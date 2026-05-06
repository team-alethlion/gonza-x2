import { db } from "../db/db";

export const SYNC_KEYS = {
  // Products & Inventory
  products: "last_sync_products",
  inventoryCategories: "last_sync_inventory_categories",

  // Customers
  customers: "last_sync_customers",
  customerCategories: "last_sync_customer_categories",

  // Sales
  saleCategories: "last_sync_sale_categories",
  saleSources: "last_sync_sale_sources",
  sales: "last_sync_sales",
  saleItems: "last_sync_sale_items",

  // Installments & Returns
  installmentPayments: "last_sync_installment_payments",
  salesReturns: "last_sync_sales_returns",
  salesReturnItems: "last_sync_sales_return_items",
} as const;

export type SyncKey = keyof typeof SYNC_KEYS;

/**
 * Get the last sync timestamp for a given key.
 * Returns null if never synced.
 */
export async function getLastSync(key: SyncKey): Promise<string | null> {
  const record = await db.settings.get(SYNC_KEYS[key]);
  return record?.value || null;
}

/**
 * Set the last sync timestamp for a given key.
 * @param key - The sync key
 * @param timestamp - ISO string timestamp (e.g., new Date().toISOString())
 */
export async function setLastSync(
  key: SyncKey,
  timestamp: string,
): Promise<void> {
  await db.settings.put({ id: SYNC_KEYS[key], value: timestamp });
}

/**
 * Clear all sync timestamps – useful for forcing a full re-sync.
 */
export async function clearAllSyncTimestamps(): Promise<void> {
  await Promise.all(
    Object.values(SYNC_KEYS).map((id) => db.settings.delete(id)),
  );
}
