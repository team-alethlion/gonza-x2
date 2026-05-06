import { db, type PendingSale } from "../db/db";
import { apiFetch } from "../utils/api";

// Callback types for UI feedback
type SyncCallbacks = {
  onStart?: (total: number) => void;
  onProgress?: (completed: number, total: number, current: PendingSale) => void;
  onSuccess?: (sale: PendingSale, response: any) => void;
  onError?: (sale: PendingSale, error: string) => void;
  onComplete?: (successCount: number, failCount: number) => void;
};

class SyncQueueService {
  private isSyncing = false;
  private callbacks: SyncCallbacks = {};

  setCallbacks(callbacks: SyncCallbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Process all pending sales (status 'pending' or 'failed')
   * Should be called when online detection fires.
   */
  async processQueue(): Promise<void> {
    // Prevent concurrent sync
    if (this.isSyncing) {
      console.log("Sync already in progress, skipping...");
      return;
    }

    // Get all pending sales (only those that are not already syncing)
    const pending = await db.pendingSales
      .where("status")
      .anyOf(["pending", "failed"])
      .toArray();

    if (pending.length === 0) {
      console.log("No pending sales to sync.");
      return;
    }

    this.isSyncing = true;
    this.callbacks.onStart?.(pending.length);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < pending.length; i++) {
      const sale = pending[i];
      this.callbacks.onProgress?.(i + 1, pending.length, sale);

      // Mark as syncing to avoid duplicate processing
      await db.pendingSales.update(sale.id, {
        status: "syncing",
        updatedAt: new Date().toISOString(),
      });

      try {
        const response = await this.sendSale(sale);
        // Sync successful
        await db.pendingSales.update(sale.id, {
          status: "pending", // will be deleted or marked as synced, but we'll delete
          syncedAt: new Date().toISOString(),
          serverId: response.id,
          receiptNumber: response.receipt_number,
        });
        // Optionally delete the pending record after successful sync
        await db.pendingSales.delete(sale.id);
        successCount++;
        this.callbacks.onSuccess?.(sale, response);
      } catch (err: any) {
        // Sync failed
        const newRetryCount = (sale.retryCount || 0) + 1;
        const errorMessage = err.message || "Unknown error";
        await db.pendingSales.update(sale.id, {
          status: "failed",
          retryCount: newRetryCount,
          errorMessage,
          updatedAt: new Date().toISOString(),
        });
        failCount++;
        this.callbacks.onError?.(sale, errorMessage);
        console.error(`Failed to sync sale ${sale.id}:`, err);
      }
    }

    this.isSyncing = false;
    this.callbacks.onComplete?.(successCount, failCount);
  }

  /**
   * Send a single sale to the backend.
   */
  private async sendSale(sale: PendingSale): Promise<any> {
    const payload = sale.data;
    // Ensure we don't send localId if it was stored (backend expects a clean payload)
    // The payload should already match the backend's expected format.
    const response = await apiFetch("/sales/sales/", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  /**
   * Add a sale to the queue (called when offline or when user chooses to save locally)
   * @param saleData - The full payload for POST /sales/sales/
   * @returns The local pending sale id
   */
  async queueSale(saleData: any): Promise<string> {
    const id = crypto.randomUUID
      ? crypto.randomUUID()
      : `pending_${Date.now()}_${Math.random()}`;
    const now = new Date().toISOString();
    const pendingSale: PendingSale = {
      id,
      data: saleData,
      createdAt: now,
      updatedAt: now,
      status: "pending",
      retryCount: 0,
    };
    await db.pendingSales.add(pendingSale);
    // Attempt to process queue immediately if online (optional)
    this.processQueue().catch(console.error);
    return id;
  }

  /**
   * Get all pending sales (for UI display)
   */
  async getPendingSales(): Promise<PendingSale[]> {
    return await db.pendingSales.toArray();
  }

  /**
   * Remove a pending sale (e.g., user cancels)
   */
  async removePendingSale(id: string): Promise<void> {
    await db.pendingSales.delete(id);
  }
}

// Singleton instance
export const syncQueue = new SyncQueueService();

// Auto process when online
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("Online detected, processing sync queue...");
    syncQueue.processQueue().catch(console.error);
  });
  // Also process once on initial load if online
  if (navigator.onLine) {
    syncQueue.processQueue().catch(console.error);
  }
}
