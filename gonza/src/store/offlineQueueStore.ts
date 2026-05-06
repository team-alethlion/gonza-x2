import { create } from "zustand";
import { db } from "../db/db";
import { apiFetch } from "../utils/api";
import { useAuthStore } from "./useAuthStore";

export interface QueuedSale {
  id: string; // local unique ID
  operation: "create" | "update" | "delete";
  data: any; // payload for the operation
  saleId?: string; // for update/delete, the server ID if known
  attempts: number; // number of sync attempts
  lastError?: string; // last error message
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

interface OfflineQueueState {
  queue: QueuedSale[];
  isProcessing: boolean;
  addToQueue: (
    operation: QueuedSale["operation"],
    data: any,
    saleId?: string,
  ) => Promise<void>;
  processQueue: () => Promise<void>;
  clearQueue: () => Promise<void>;
  getPendingCount: () => Promise<number>;
}

export const useOfflineQueueStore = create<OfflineQueueState>((set, get) => ({
  queue: [],
  isProcessing: false,

  addToQueue: async (operation, data, saleId) => {
    const queuedSale: QueuedSale = {
      id: crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substr(2, 9),
      operation,
      data,
      saleId,
      attempts: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store in Dexie for persistence
    const existingQueue = await db.settings.get("offline_queue");
    const currentQueue = existingQueue?.value || [];
    currentQueue.push(queuedSale);
    await db.settings.put({ id: "offline_queue", value: currentQueue });

    set({ queue: currentQueue });

    // If online, try to process immediately
    if (navigator.onLine) {
      await get().processQueue();
    }
  },

  processQueue: async () => {
    if (get().isProcessing) return;

    const existingQueue = await db.settings.get("offline_queue");
    const queue = existingQueue?.value || [];
    if (queue.length === 0) return;

    set({ isProcessing: true });

    const { user } = useAuthStore.getState();
    const branchId = user?.branch?.id;

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      try {
        if (item.operation === "create") {
          // Add branchId and userId if missing in data
          const payload = {
            ...item.data,
            branchId: item.data.branchId || branchId,
            userId: item.data.userId || user?.id,
          };
          const res = await apiFetch("/sales/sales/", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error(await res.text());
          const result = await res.json();
          // Optionally store the server-generated ID mapping
          await db.settings.put({
            id: `offline_mapping_${item.id}`,
            value: {
              localId: item.id,
              serverId: result.id,
              receiptNumber: result.receipt_number,
            },
          });
        } else if (item.operation === "update") {
          const { saleId, data } = item;
          if (!saleId) throw new Error("Missing saleId for update");
          const res = await apiFetch(`/sales/sales/${saleId}/`, {
            method: "PUT",
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(await res.text());
        } else if (item.operation === "delete") {
          const { saleId } = item;
          if (!saleId) throw new Error("Missing saleId for delete");
          const res = await apiFetch(`/sales/sales/${saleId}/`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error(await res.text());
        }

        // Remove item from queue on success
        const updatedQueue = queue.filter((_, idx) => idx !== i);
        await db.settings.put({ id: "offline_queue", value: updatedQueue });
        set({ queue: updatedQueue });
      } catch (error: any) {
        // Update attempts and error
        item.attempts += 1;
        item.lastError = error.message;
        item.updatedAt = new Date().toISOString();
        const updatedQueue = [...queue];
        updatedQueue[i] = item;
        await db.settings.put({ id: "offline_queue", value: updatedQueue });
        set({ queue: updatedQueue });
        // Stop processing if max attempts reached? For now continue
      }
    }

    set({ isProcessing: false });
  },

  clearQueue: async () => {
    await db.settings.delete("offline_queue");
    set({ queue: [] });
  },

  getPendingCount: async () => {
    const existingQueue = await db.settings.get("offline_queue");
    return existingQueue?.value?.length || 0;
  },
}));

// Listen for online/offline events to trigger processing
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    useOfflineQueueStore.getState().processQueue();
  });
}
