import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { CONFIG, getApiUrl } from "../config";

export type SubscriptionStatus = "active" | "expired" | "none" | "trial" | "suspended";
export type BillingCycle = "monthly" | "yearly";

export interface Package {
  id: string;
  name: string;
  description: string;
  monthly_price: number;
  yearly_price: number;
  max_users: number;
  unlimited_users: boolean;
  max_sales_per_month: number;
  unlimited_sales: boolean;
  max_products: number;
  unlimited_products: boolean;
  has_free_trial: boolean;
  trial_days: number;
  features: Record<string, string[]>;
}

interface SubscriptionState {
  packages: Package[];
  isLoading: boolean;
  error: string | null;
  // Actions
  fetchPackages: () => Promise<void>;
  subscribe: (planId: string, cycle: BillingCycle) => Promise<void>;
  upgrade: (planId: string) => Promise<void>;
  reactivate: () => Promise<void>;
  startTrial: (planId: string) => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  packages: [],
  isLoading: false,
  error: null,

  fetchPackages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { token } = useAuthStore.getState();
      const res = await fetch(getApiUrl(`${CONFIG.API.CORE.BASE}packages/`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();
      // Handle paginated or direct array response
      const packageList = Array.isArray(data) ? data : (data.results || []);
      set({ packages: packageList, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  subscribe: async (planId, cycle) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user, refreshProfile } = useAuthStore.getState();
      if (!token || !user?.agency?.id) throw new Error("Authentication required");

      const res = await fetch(getApiUrl(`${CONFIG.API.CORE.BASE}subscriptions/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          package: planId,
          billing_cycle: cycle,
          agency: user.agency.id,
          user: user.id,
        }),
      });

      if (!res.ok) throw new Error("Failed to initiate subscription");
      
      // For now, we simulate success or handle payment redirect here
      await refreshProfile();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  upgrade: async (planId) => {
    // Upgrades usually involve the same logic as subscribe but might handle prorating
    const { subscribe } = get();
    await subscribe(planId, "monthly"); // Default to monthly for now
  },

  reactivate: async () => {
    const { user } = useAuthStore.getState();
    const currentPlanId = user?.agency?.package?.id;
    if (currentPlanId) {
      const { subscribe } = get();
      await subscribe(currentPlanId, "monthly");
    }
  },

  startTrial: async (planId) => {
    set({ isLoading: true, error: null });
    try {
      const { token, user, refreshProfile } = useAuthStore.getState();
      if (!token || !user?.agency?.id) throw new Error("Authentication required");

      const res = await fetch(getApiUrl(`${CONFIG.API.CORE.BASE}agencies/${user.agency.id}/activate_trial/`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packageId: planId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to activate trial");
      }
      
      await refreshProfile();
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
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
