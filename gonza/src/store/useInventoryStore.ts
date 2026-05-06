import { create } from "zustand";
import {
  db,
  type Category,
  type Product,
  type Sale,
  type SaleItem,
  type SaleSource,
} from "../db/db";
import { apiFetch } from "../utils/api";

interface InventoryState {
  loading: boolean;
  error: string | null;
  lastSync: number | null;
  sync: (force?: boolean) => Promise<void>;
  syncCategories: () => Promise<void>;
  syncSaleCategories: () => Promise<void>;
  syncCustomerCategories: () => Promise<void>;
  syncSaleSources: () => Promise<void>;
  syncProducts: () => Promise<void>;
  syncSales: (branchId?: string, fromDate?: string) => Promise<void>;
  syncSaleItems: (saleIds?: string[]) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  loading: false,
  error: null,
  lastSync: null,

  syncCategories: async () => {
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
      console.error("Category sync failed:", err);
    }
  },

  syncSaleCategories: async () => {
    try {
      const res = await apiFetch("/sales/categories/");
      if (res.ok) {
        const data = await res.json();
        const categories: Category[] = Array.isArray(data)
          ? data
          : data.results || [];
        await db.saleCategories.clear();
        await db.saleCategories.bulkPut(categories);
      }
    } catch (err) {
      console.error("Sale Category sync failed:", err);
    }
  },

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
      console.error("Customer Category sync failed:", err);
    }
  },

  syncSaleSources: async () => {
    try {
      const res = await apiFetch("/sales/sources/");
      if (res.ok) {
        const data = await res.json();
        const sources: SaleSource[] = Array.isArray(data)
          ? data
          : data.results || [];
        await db.saleSources.clear();
        await db.saleSources.bulkPut(sources);
      }
    } catch (err) {
      console.error("Sale Source sync failed:", err);
    }
  },

  syncProducts: async () => {
    try {
      const res = await apiFetch("/inventory/products/");
      if (res.ok) {
        const data = await res.json();
        const products: Product[] = Array.isArray(data)
          ? data
          : data.results || [];
        await db.products.clear();
        await db.products.bulkPut(products);
      }
    } catch (err) {
      console.error("Products sync failed:", err);
    }
  },

  syncSales: async (branchId?: string, fromDate?: string) => {
    try {
      let url = "/sales/sales/";
      const params = new URLSearchParams();
      if (branchId) params.append("branchId", branchId);
      if (fromDate) params.append("created_at__gte", fromDate);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await apiFetch(url);
      if (res.ok) {
        const data = await res.json();
        const sales: Sale[] = Array.isArray(data) ? data : data.results || [];
        await db.sales.bulkPut(sales);
      }
    } catch (err) {
      console.error("Sales sync failed:", err);
    }
  },

  syncSaleItems: async (saleIds?: string[]) => {
    try {
      let url = "/sales/items/";
      if (saleIds && saleIds.length) {
        const idsParam = saleIds.join(",");
        url += `?sale__id__in=${idsParam}`;
      }
      const res = await apiFetch(url);
      if (res.ok) {
        const data = await res.json();
        const items: SaleItem[] = Array.isArray(data)
          ? data
          : data.results || [];
        await db.saleItems.bulkPut(items);
      }
    } catch (err) {
      console.error("Sale items sync failed:", err);
    }
  },

  sync: async (force = false) => {
    if (get().loading) return;

    const now = Date.now();
    const { lastSync } = get();
    if (!force && lastSync && now - lastSync < 5 * 60 * 1000) {
      console.log("Skipping inventory sync - recently synced.");
      return;
    }

    set({ loading: true, error: null });

    try {
      console.log("Starting global inventory sync...");

      // Sync all categories, sources, and products
      await Promise.all([
        get().syncCategories(),
        get().syncSaleCategories(),
        get().syncCustomerCategories(),
        get().syncSaleSources(),
        get().syncProducts(),
      ]);

      // Sync recent sales (last 30 days by default)
      const thirtyDaysAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString();
      await get().syncSales(undefined, thirtyDaysAgo);

      // Sync sale items for the synced sales
      const sales = await db.sales.toArray();
      const saleIds = sales.map((s) => s.id);
      if (saleIds.length) {
        await get().syncSaleItems(saleIds);
      }

      set({ lastSync: Date.now(), loading: false });
      console.log("Global sync completed.");
    } catch (err: any) {
      console.error("Global sync failed:", err);
      set({
        error: `Sync failed: ${err.message || "Unknown error"}`,
        loading: false,
      });
    }
  },
}));
