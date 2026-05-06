// src/store/useFinanceStore.ts
import { create } from "zustand";
import { db, type ExpenseCategory, type Expense } from "../db/db";
import { apiFetch } from "../utils/api";
import { syncDelta } from "../utils/syncDelta";
import { getLastSync, setLastSync } from "../utils/lastSync";

interface FinanceState {
  loading: boolean;
  error: string | null;
  lastSync: number | null;
  sync: (force?: boolean, branchId?: string) => Promise<void>;
  syncExpenseCategories: (branchId?: string) => Promise<void>;
  syncExpenses: (
    branchId?: string,
    startDate?: string,
    endDate?: string,
  ) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  loading: false,
  error: null,
  lastSync: null,

  syncExpenseCategories: async (branchId?: string) => {
    try {
      // Full sync for categories (they don't have updated_at)
      let url = "/finance/categories/";
      if (branchId) url += `?branchId=${branchId}`;
      const res = await apiFetch(url);
      if (res.ok) {
        const data = await res.json();
        const categories: ExpenseCategory[] = Array.isArray(data)
          ? data
          : data.results || [];
        await db.expenseCategories.clear();
        await db.expenseCategories.bulkPut(categories);
      }
    } catch (err) {
      console.error("Expense categories sync failed:", err);
    }
  },

  syncExpenses: async (
    branchId?: string,
    startDate?: string,
    endDate?: string,
  ) => {
    try {
      const since = await getLastSync("expenses");
      const filters: Record<string, any> = {};
      if (branchId) filters.branchId = branchId;
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;

      const newSince = await syncDelta<Expense>({
        url: "/finance/expenses/",
        table: db.expenses,
        since: since,
        filters,
      });
      await setLastSync("expenses", newSince);
    } catch (err) {
      console.error("Expenses delta sync failed:", err);
      throw err;
    }
  },

  sync: async (
    force = false,
    branchId?: string,
    startDate?: string,
    endDate?: string,
  ) => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      if (force) {
        await setLastSync("expenses", new Date(0).toISOString());
      }
      await Promise.all([
        get().syncExpenseCategories(branchId),
        get().syncExpenses(branchId, startDate, endDate),
      ]);
      set({ lastSync: Date.now(), loading: false });
    } catch (err: any) {
      console.error("Finance sync failed:", err);
      set({ error: err.message, loading: false });
    }
  },
}));
