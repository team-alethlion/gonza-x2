import { create } from "zustand";
import { db, type Category, type Product } from "../db/db";
import { apiFetch } from "../utils/api";
import { syncDelta } from "../utils/syncDelta";
import { getLastSync, setLastSync } from "../utils/lastSync";

interface ProductState {
  loading: boolean;
  error: string | null;
  lastSync: number | null;
  sync: (force?: boolean, branchId?: string) => Promise<void>;
  syncInventoryCategories: () => Promise<void>;
  syncProducts: (branchId?: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  loading: false,
  error: null,
  lastSync: null,

  syncInventoryCategories: async () => {
    try {
      const res = await apiFetch("/inventory/categories/");
      if (res.ok) {
        const data = await res.json();
        const categories: Category[] = Array.isArray(data)
          ? data
          : data.results || [];
        await db.categories.clear();
        await db.categories.bulkPut(categories);
      }
    } catch (err) {
      console.error("Inventory categories sync failed:", err);
    }
  },

  syncProducts: async (branchId?: string) => {
    try {
      const since = await getLastSync("products");
      const filters = branchId ? { branchId } : {};
      const newSince = await syncDelta<Product>({
        url: "/inventory/products/",
        table: db.products,
        since: since,
        filters,
      });
      await setLastSync("products", newSince);
    } catch (err) {
      console.error("Products delta sync failed:", err);
      throw err;
    }
  },

  sync: async (force = false, branchId?: string) => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      // If force is true, clear the stored sync timestamp to force full sync
      if (force) {
        await setLastSync("products", new Date(0).toISOString());
      }

      await Promise.all([
        get().syncInventoryCategories(),
        get().syncProducts(branchId),
      ]);

      set({ lastSync: Date.now(), loading: false });
    } catch (err: any) {
      console.error("Product sync failed:", err);
      set({ error: err.message, loading: false });
    }
  },
}));
