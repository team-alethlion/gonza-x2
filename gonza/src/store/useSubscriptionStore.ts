import { create } from "zustand";
import { db } from "../db/db";

export type SubscriptionStatus = "active" | "expired" | "none";
export type BillingCycle = "monthly" | "yearly";

interface SubscriptionState {
  currentPlanId: string | null;
  status: SubscriptionStatus;
  hasUsedTrial: boolean;
  billingCycle: BillingCycle;
  isInitialized: boolean;
  
  // Actions
  subscribe: (planId: string, cycle: BillingCycle) => Promise<void>;
  upgrade: (planId: string) => Promise<void>;
  reactivate: () => Promise<void>;
  startTrial: (planId: string) => Promise<void>;
  init: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  currentPlanId: null,
  status: "none",
  hasUsedTrial: false,
  billingCycle: "monthly",
  isInitialized: false,

  init: async () => {
    try {
      const subData = await db.settings.get("user-subscription");
      if (subData) {
        set({ ...subData.value, isInitialized: true });
      } else {
        set({ isInitialized: true });
      }
    } catch (error) {
      console.error("Failed to init subscription:", error);
      set({ isInitialized: true });
    }
  },

  subscribe: async (planId, cycle) => {
    const newState = {
      currentPlanId: planId,
      status: "active" as SubscriptionStatus,
      hasUsedTrial: get().hasUsedTrial,
      billingCycle: cycle,
    };
    await db.settings.put({ id: "user-subscription", value: newState });
    set(newState);
  },

  upgrade: async (planId) => {
    const newState = {
      ...get(),
      currentPlanId: planId,
      status: "active" as SubscriptionStatus,
    };
    await db.settings.put({ id: "user-subscription", value: newState });
    set(newState);
  },

  reactivate: async () => {
    const newState = {
      ...get(),
      status: "active" as SubscriptionStatus,
    };
    await db.settings.put({ id: "user-subscription", value: newState });
    set(newState);
  },

  startTrial: async (planId) => {
    const newState = {
      currentPlanId: planId,
      status: "active" as SubscriptionStatus,
      hasUsedTrial: true,
      billingCycle: "monthly" as BillingCycle,
    };
    await db.settings.put({ id: "user-subscription", value: newState });
    set(newState);
  },
}));

// Initialize
if (typeof window !== "undefined") {
  useSubscriptionStore.getState().init();
}
