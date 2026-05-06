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

  // Finance
  expenses: "last_sync_expenses",
  expenseCategories: "last_sync_expense_categories",
} as const;

export type SyncKey = keyof typeof SYNC_KEYS;

export async function getLastSync(key: SyncKey): Promise<string | null> {
  const record = await db.settings.get(SYNC_KEYS[key]);
  return record?.value || null;
}

export async function setLastSync(
  key: SyncKey,
  timestamp: string,
): Promise<void> {
  await db.settings.put({ id: SYNC_KEYS[key], value: timestamp });
}

export async function clearAllSyncTimestamps(): Promise<void> {
  await Promise.all(
    Object.values(SYNC_KEYS).map((id) => db.settings.delete(id)),
  );
}
