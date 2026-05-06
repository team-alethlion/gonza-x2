import Dexie from "dexie";
import { apiFetch } from "./api";

export interface SyncOptions<T> {
  url: string; // API endpoint (without query params)
  table: Dexie.Table<T, string>; // Dexie table to store records
  since?: string | null; // ISO timestamp for updated_at__gte
  filters?: Record<string, any>; // extra query params e.g. { branchId: '...' }
  onProgress?: (fetched: number) => void;
}

/**
 * Fetches all pages of a DRF paginated endpoint (LimitOffsetPagination)
 * and upserts records into Dexie using bulkPut.
 * Returns the most recent updated_at value from fetched records,
 * or current time if no records and since was null.
 */
export async function syncDelta<T extends { id: string; updated_at: string }>(
  options: SyncOptions<T>,
): Promise<string> {
  const { url, table, since, filters = {}, onProgress } = options;

  const params = new URLSearchParams();

  // Add delta filter if since provided
  if (since) {
    params.append("updated_at__gte", since);
  }

  // Add extra filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });

  let nextUrl: string | null = `${url}?${params.toString()}`;
  let fetchedCount = 0;
  let latestUpdatedAt = since || new Date(0).toISOString();

  while (nextUrl) {
    const res = await apiFetch(nextUrl);
    if (!res.ok) {
      throw new Error(`Delta sync failed for ${url}: ${res.status}`);
    }

    const data = await res.json();
    const results: T[] = data.results || [];

    if (results.length > 0) {
      // Upsert all records (bulkPut overwrites existing with same id)
      await table.bulkPut(results);
      fetchedCount += results.length;

      // Find the maximum updated_at in this batch
      const batchLatest = results.reduce(
        (max, item) => (item.updated_at > max ? item.updated_at : max),
        latestUpdatedAt,
      );
      if (batchLatest > latestUpdatedAt) latestUpdatedAt = batchLatest;
    }

    nextUrl = data.next;
    if (onProgress) onProgress(fetchedCount);
  }

  // If no records were fetched and we had no since, set latest to now
  if (fetchedCount === 0 && !since) {
    latestUpdatedAt = new Date().toISOString();
  }

  return latestUpdatedAt;
}
