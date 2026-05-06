import Dexie, { type EntityTable } from "dexie";

// ========== EXISTING INTERFACES (unchanged) ==========
export interface Setting {
  id: string;
  value: any;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  agency?: string;
}

export interface Product {
  id: string;
  name: string;
  selling_price: number;
  cost_price: number;
  stock: number;
  category?: string;
  branch?: string;
  updated_at: string;
}

export interface SaleSource {
  id: string;
  name: string;
  description?: string;
  agency?: string;
  branch?: string;
  user?: string;
  created_at?: string;
  updated_at?: string;
}

// ========== CUSTOMER (new) ==========
export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  category?: string; // customer category id
  agency?: string;
  branch?: string;
  total_purchases?: number;
  created_at?: string;
  updated_at?: string;
}

// ========== FINANCE INTERFACES ==========
export interface ExpenseCategory {
  id: string;
  name: string;
  is_default?: boolean;
  agency?: string;
  branch?: string;
  user?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  payment_method?: string;
  person_in_charge?: string;
  reference?: string;
  agency?: string;
  branch?: string;
  user?: string;
  receipt_image?: string;
  cash_account?: string;
  cash_transaction?: string;
  created_at: string;
  updated_at: string;
}

// ========== SALES MODELS (already defined but ensure completeness) ==========
export interface Sale {
  id: string;
  receipt_number?: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  total_cost: number;
  profit: number;
  amount_paid: number;
  balance_due: number;
  status: string;
  payment_method?: string;
  date: string;
  notes?: string;
  agency?: string;
  branch?: string;
  customer?: string; // customer id
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  user?: string;
  category?: string; // sale category id
  source?: string; // sale source id
  discount_reason?: string;
  shipping_cost?: number;
  payment_reference?: string;
  cash_transaction?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  deleted_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface SaleItem {
  id: string;
  sale: string;
  product?: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  discount: number;
  discount_type: string;
  discount_percentage: number;
  total: number;
  cost_price: number;
  quantity_returned?: number;
  agency?: string;
  branch?: string;
  created_at: string;
  updated_at: string;
}

export interface InstallmentPayment {
  id: string;
  sale: string;
  amount: number;
  date: string;
  payment_method: string;
  reference?: string;
  status: string;
  notes?: string;
  agency?: string;
  branch?: string;
  received_by?: string;
  cash_account?: string;
  cash_transaction?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesReturn {
  id: string;
  sale: string;
  return_number?: string;
  total_refund_amount: number;
  reason?: string;
  status: string;
  date: string;
  agency?: string;
  branch?: string;
  user?: string;
  cash_account?: string;
  cash_transaction?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesReturnItem {
  id: string;
  sales_return: string;
  sale_item: string;
  product?: string;
  quantity: number;
  refund_amount: number;
  restock_inventory: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  status: string;
  customer?: string;
  customer_name?: string;
  customer_phone?: string;
  agency?: string;
  branch?: string;
  user?: string;
  created_at: string;
  updated_at: string;
}

export interface SalesGoal {
  id: string;
  amount_target: number;
  sales_count_target: number;
  products_sold_target: number;
  period: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";
  period_name?: string;
  start_date: string;
  end_date: string;
  status: string;
  agency?: string;
  branch?: string;
  user?: string;
  created_at: string;
  updated_at: string;
}

export interface PendingSale {
  id: string; // local UUID
  data: any; // full sale payload (matching backend POST /sales/sales/)
  createdAt: string; // ISO timestamp
  updatedAt: string; // for retry tracking
  status: "pending" | "syncing" | "failed" | "conflict";
  retryCount: number;
  errorMessage?: string;
  syncedAt?: string; // when successfully synced
  serverId?: string; // returned id after sync
  receiptNumber?: string; // returned receipt number
}

// ========== DATABASE DECLARATION ==========
export const db = new Dexie("GonzaDB") as Dexie & {
  settings: EntityTable<Setting, "id">;
  categories: EntityTable<Category, "id">;
  customerCategories: EntityTable<Category, "id">;
  saleCategories: EntityTable<Category, "id">;
  saleSources: EntityTable<SaleSource, "id">;
  products: EntityTable<Product, "id">;

  // New tables
  customers: EntityTable<Customer, "id">;
  sales: EntityTable<Sale, "id">;
  saleItems: EntityTable<SaleItem, "id">;
  installmentPayments: EntityTable<InstallmentPayment, "id">;
  salesReturns: EntityTable<SalesReturn, "id">;
  salesReturnItems: EntityTable<SalesReturnItem, "id">;

  pendingSales: EntityTable<PendingSale, "id">;
  // Inside the db type declaration (after pendingSales)
  expenseCategories: EntityTable<ExpenseCategory, "id">;
  expenses: EntityTable<Expense, "id">;
  appointments: EntityTable<Appointment, "id">;
  salesGoals: EntityTable<SalesGoal, "id">;
};

// Add after the SalesReturnItem interface (before the db declaration)

// Version 3 – original schema (as you had before)
db.version(3).stores({
  settings: "id",
  categories: "id, name",
  customerCategories: "id, name",
  saleCategories: "id, name",
  saleSources: "id, name, branch", // you had this in version 3 already
  products: "id, name, category, branch",
});
// Version 4 – full schema (customers + sales tables)
db.version(4)
  .stores({
    settings: "id",
    categories: "id, name",
    customerCategories: "id, name",
    saleCategories: "id, name",
    saleSources: "id, name, branch",
    products: "id, name, category, branch",

    customers: "id, name, phone, email, branch, category",
    sales:
      "id, receipt_number, status, date, branch, customer, user, is_deleted, created_at",
    saleItems: "id, sale, product, branch",
    installmentPayments: "id, sale, status, date, branch",
    salesReturns: "id, sale, status, date, branch",
    salesReturnItems: "id, sales_return, sale_item",
    pendingSales: "id, status, createdAt, updatedAt",
    expenseCategories: "id, name, branch",
    expenses: "id, branch, category, date, updated_at",
  })
  .upgrade(async (tx) => {
    console.log("🔄 Running Dexie upgrade from version <4 to 4");
    await tx.table("settings").put({ id: "db_version", value: 4 });
  });

// Version 5 – appointments table
db.version(5)
  .stores({
    appointments: "id, branch, status, start_time, updated_at",
  })
  .upgrade(async (tx) => {
    console.log("🔄 Running Dexie upgrade from version 4 to 5");
    await tx.table("settings").put({ id: "db_version", value: 5 });
  });

// Version 6 – sales goals table
db.version(6)
  .stores({
    salesGoals: "id, branch, period, status, updated_at",
  })
  .upgrade(async (tx) => {
    console.log("🔄 Running Dexie upgrade from version 5 to 6");
    await tx.table("settings").put({ id: "db_version", value: 6 });
  });

// If you already have version 3, Dexie will upgrade automatically.
// To avoid conflicts, you can also open with db.open() – Dexie handles it.
