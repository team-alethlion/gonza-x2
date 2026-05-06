import { create } from "zustand";
import {
  db,
  type Category,
  type SaleSource,
  type Sale,
  type SaleItem,
  type InstallmentPayment,
  type SalesReturn,
  type SalesReturnItem,
} from "../db/db";
import { apiFetch } from "../utils/api";
import { syncDelta } from "../utils/syncDelta";
import { getLastSync, setLastSync } from "../utils/lastSync";

interface SalesState {
  loading: boolean;
  error: string | null;
  lastSync: number | null;
  sync: (force?: boolean, branchId?: string) => Promise<void>;
  syncSaleCategories: () => Promise<void>;
  syncSaleSources: () => Promise<void>;
  syncSales: (branchId?: string) => Promise<void>;
  syncSaleItems: (branchId?: string) => Promise<void>;
  syncInstallments: (branchId?: string) => Promise<void>;
  syncReturns: (branchId?: string) => Promise<void>;
  syncReturnItems: (branchId?: string) => Promise<void>;
}

export const useSalesStore = create<SalesState>((set, get) => ({
  loading: false,
  error: null,
  lastSync: null,

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
      console.error("Sale categories sync failed:", err);
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
      console.error("Sale sources sync failed:", err);
    }
  },

  syncSales: async (branchId?: string) => {
    try {
      const since = await getLastSync("sales");
      const filters = branchId ? { branchId } : {};
      const newSince = await syncDelta<Sale>({
        url: "/sales/sales/",
        table: db.sales,
        since: since,
        filters,
      });
      await setLastSync("sales", newSince);
    } catch (err) {
      console.error("Sales delta sync failed:", err);
      throw err;
    }
  },

  syncSaleItems: async (branchId?: string) => {
    try {
      const since = await getLastSync("saleItems");
      const filters = branchId ? { branchId } : {};
      const newSince = await syncDelta<SaleItem>({
        url: "/sales/items/",
        table: db.saleItems,
        since: since,
        filters,
      });
      await setLastSync("saleItems", newSince);
    } catch (err) {
      console.error("Sale items delta sync failed:", err);
      throw err;
    }
  },

  syncInstallments: async (branchId?: string) => {
    try {
      const since = await getLastSync("installmentPayments");
      const filters = branchId ? { branchId } : {};
      const newSince = await syncDelta<InstallmentPayment>({
        url: "/sales/installments/",
        table: db.installmentPayments,
        since: since,
        filters,
      });
      await setLastSync("installmentPayments", newSince);
    } catch (err) {
      console.error("Installments delta sync failed:", err);
      throw err;
    }
  },

  syncReturns: async (branchId?: string) => {
    try {
      const since = await getLastSync("salesReturns");
      const filters = branchId ? { branchId } : {};
      const newSince = await syncDelta<SalesReturn>({
        url: "/sales/returns/",
        table: db.salesReturns,
        since: since,
        filters,
      });
      await setLastSync("salesReturns", newSince);
    } catch (err) {
      console.error("Returns delta sync failed:", err);
      throw err;
    }
  },

  syncReturnItems: async (branchId?: string) => {
    try {
      const since = await getLastSync("salesReturnItems");
      const filters = branchId ? { branchId } : {};
      const newSince = await syncDelta<SalesReturnItem>({
        url: "/sales/return-items/",
        table: db.salesReturnItems,
        since: since,
        filters,
      });
      await setLastSync("salesReturnItems", newSince);
    } catch (err) {
      console.error("Return items delta sync failed:", err);
      throw err;
    }
  },

  sync: async (force = false, branchId?: string) => {
    if (get().loading) return;

    set({ loading: true, error: null });

    try {
      if (force) {
        await setLastSync("sales", new Date(0).toISOString());
        await setLastSync("saleItems", new Date(0).toISOString());
        await setLastSync("installmentPayments", new Date(0).toISOString());
        await setLastSync("salesReturns", new Date(0).toISOString());
        await setLastSync("salesReturnItems", new Date(0).toISOString());
      }

      await Promise.all([
        get().syncSaleCategories(),
        get().syncSaleSources(),
        get().syncSales(branchId),
        get().syncSaleItems(branchId),
        get().syncInstallments(branchId),
        get().syncReturns(branchId),
        get().syncReturnItems(branchId),
      ]);

      set({ lastSync: Date.now(), loading: false });
    } catch (err: any) {
      console.error("Sales sync failed:", err);
      set({ error: err.message, loading: false });
    }
  },
}));
