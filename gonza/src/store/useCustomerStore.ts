import { create } from "zustand";
import { db, type Category, type Customer } from "../db/db";
import { apiFetch } from "../utils/api";
import { syncDelta } from "../utils/syncDelta";
import { getLastSync, setLastSync } from "../utils/lastSync";

interface CustomerState {
  loading: boolean;
  error: string | null;
  lastSync: number | null;
  sync: (force?: boolean, branchId?: string) => Promise<void>;
  syncCustomerCategories: () => Promise<void>;
  syncCustomers: (branchId?: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  loading: false,
  error: null,
  lastSync: null,

  syncCustomerCategories: async () => {
    try {
      const res = await apiFetch("/customers/categories/");
      if (res.ok) {
        const data = await res.json();
        const categories: Category[] = Array.isArray(data)
          ? data
          : data.results || [];
        await db.customerCategories.clear();
        await db.customerCategories.bulkPut(categories);
      }
    } catch (err) {
      console.error("Customer categories sync failed:", err);
    }
  },

  syncCustomers: async (branchId?: string) => {
    try {
      const since = await getLastSync("customers");
      const filters = branchId ? { branchId } : {};
      const newSince = await syncDelta<Customer>({
        url: "/customers/customers/",
        table: db.customers,
        since: since,
        filters,
      });
      await setLastSync("customers", newSince);
    } catch (err) {
      console.error("Customers delta sync failed:", err);
      throw err;
    }
  },

  sync: async (force = false, branchId?: string) => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      if (force) {
        await setLastSync("customers", new Date(0).toISOString());
      }

      await Promise.all([
        get().syncCustomerCategories(),
        get().syncCustomers(branchId),
      ]);

      set({ lastSync: Date.now(), loading: false });
    } catch (err: any) {
      console.error("Customer sync failed:", err);
      set({ error: err.message, loading: false });
    }
  },
}));
