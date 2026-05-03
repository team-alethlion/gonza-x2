import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

export type SubscriptionStatus = "active" | "expired" | "none" | "trial";
export type BillingCycle = "monthly" | "yearly";

interface SubscriptionState {
  // Actions
  subscribe: (planId: string, cycle: BillingCycle) => Promise<void>;
  upgrade: (planId: string) => Promise<void>;
  reactivate: () => Promise<void>;
  startTrial: (planId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((_set) => ({
  subscribe: async (planId, cycle) => {
    console.log("Subscribing to:", planId, cycle);
    // TODO: Implement backend call
  },

  upgrade: async (planId) => {
    console.log("Upgrading to:", planId);
    // TODO: Implement backend call
  },

  reactivate: async () => {
    console.log("Reactivating subscription");
    // TODO: Implement backend call
  },

  startTrial: async (planId) => {
    console.log("Starting trial for:", planId);
    // TODO: Implement backend call
  },
}));

/**
 * Derived helper hook to get subscription status from auth store
 */
export const useSubscription = () => {
  const { user } = useAuthStore();
  const agency = user?.agency;

  return {
    currentPlanId: agency?.package?.id || null,
    status: (agency?.subscription_status || "none") as SubscriptionStatus,
    hasUsedTrial: agency?.had_trial_before || false,
    daysLeft: agency?.days_left ?? 0,
    isTrial: agency?.subscription_status === 'trial',
    isInitialized: true,
  };
};
