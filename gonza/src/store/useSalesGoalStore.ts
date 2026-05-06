import { create } from "zustand";
import { db, type SalesGoal } from "../db/db";
import { apiFetch } from "../utils/api";
import { syncDelta } from "../utils/syncDelta";

interface SalesGoalState {
  loading: boolean;
  error: string | null;
  lastSync: number | null;
  sync: (force?: boolean, branchId?: string) => Promise<void>;
  setGoal: (data: {
    period: "DAILY" | "WEEKLY" | "MONTHLY";
    amount_target: number;
    branchId: string;
    agencyId?: string;
  }) => Promise<SalesGoal | null>;
}

export const useSalesGoalStore = create<SalesGoalState>((set, get) => ({
  loading: false,
  error: null,
  lastSync: null,

  sync: async (force = false, branchId?: string) => {
    if (get().loading) return;
    if (!force && get().lastSync && Date.now() - get().lastSync! < 300000) return; // 5 min cache

    set({ loading: true, error: null });

    try {
      const lastRecord = await db.salesGoals.orderBy("updated_at").last();
      const since = lastRecord ? lastRecord.updated_at : undefined;

      await syncDelta<SalesGoal>({
        url: "/sales/goals/",
        table: db.salesGoals,
        since,
        filter: branchId ? { branchId } : {},
      });

      set({ lastSync: Date.now(), loading: false });
    } catch (err: any) {
      console.error("Sales Goal sync failed:", err);
      set({ error: err.message, loading: false });
    }
  },

  setGoal: async (data) => {
    try {
      // 1. Calculate period_name and dates
      const now = new Date();
      let period_name = "";
      let start_date = new Date();
      let end_date = new Date();

      if (data.period === "DAILY") {
        period_name = `DAILY-${now.toISOString().split("T")[0]}`;
        start_date.setHours(0, 0, 0, 0);
        end_date.setHours(23, 59, 59, 999);
      } else if (data.period === "WEEKLY") {
        // Simple week identifier (Year-WeekNumber)
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        period_name = `WEEKLY-${now.getFullYear()}-W${weekNum}`;
        
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        start_date = new Date(now.setDate(diff));
        start_date.setHours(0, 0, 0, 0);
        end_date = new Date(start_date);
        end_date.setDate(start_date.getDate() + 6);
        end_date.setHours(23, 59, 59, 999);
      } else if (data.period === "MONTHLY") {
        period_name = `MONTHLY-${now.getFullYear()}-${now.getMonth() + 1}`;
        start_date = new Date(now.getFullYear(), now.getMonth(), 1);
        end_date = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end_date.setHours(23, 59, 59, 999);
      }

      const payload = {
        ...data,
        period_name,
        start_date: start_date.toISOString(),
        end_date: end_date.toISOString(),
      };

      // 2. Optimistic Update in Dexie
      // We look for existing goal for this period/branch to update it
      const existing = await db.salesGoals
        .where({ branch: data.branchId, period: data.period, period_name })
        .first();

      const localId = existing?.id || `temp-${Date.now()}`;
      const localGoal: SalesGoal = {
        id: localId,
        ...payload,
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      await db.salesGoals.put(localGoal);

      // 3. API Call
      const res = await apiFetch("/sales/goals/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedGoal = await res.json();
        // Replace temp record with server record
        if (localId.startsWith("temp-")) {
            await db.salesGoals.delete(localId);
        }
        await db.salesGoals.put(savedGoal);
        return savedGoal;
      }
      return localGoal;
    } catch (err) {
      console.error("Failed to set sales goal:", err);
      return null;
    }
  },
}));
