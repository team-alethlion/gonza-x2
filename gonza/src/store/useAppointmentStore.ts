import { create } from "zustand";
import { db, type Appointment } from "../db/db";
import { apiFetch } from "../utils/api";
import { syncDelta } from "../utils/syncDelta";

interface AppointmentState {
  loading: boolean;
  error: string | null;
  lastSync: number | null;
  sync: (force?: boolean, branchId?: string) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  loading: false,
  error: null,
  lastSync: null,

  sync: async (force = false, branchId?: string) => {
    if (get().loading) return;
    
    // Throttle sync to once per minute unless forced
    if (!force && get().lastSync && Date.now() - get().lastSync! < 60000) {
      return;
    }

    set({ loading: true, error: null });

    try {
      // 1. Fetch since last sync
      const lastRecord = await db.appointments.orderBy("updated_at").last();
      const since = lastRecord ? lastRecord.updated_at : undefined;

      await syncDelta<Appointment>({
        url: "/appointments/",
        table: db.appointments,
        since,
        filter: branchId ? { branchId } : {},
      });

      set({ lastSync: Date.now(), loading: false });
    } catch (err: any) {
      console.error("Appointment sync failed:", err);
      set({ error: err.message, loading: false });
    }
  },
}));
