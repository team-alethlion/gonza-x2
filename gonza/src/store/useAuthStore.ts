import { create } from "zustand";
import { db } from "../db/db";
import { CONFIG, getApiUrl } from "../config";

interface Package {
  id: string;
  name: string;
  monthly_price: number;
  yearly_price: number;
  trial_days: number;
  has_free_trial: boolean;
}

interface Agency {
  id: string;
  name: string;
  subscription_status: "trial" | "active" | "expired" | "suspended";
  had_trial_before: boolean;
  days_left: number;
  is_trial: boolean;
  is_onboarded: boolean;
  package?: Package;
}

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  image?: string;
  is_onboarded: boolean;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "EXPIRED";
  is_frozen: boolean;
  role?: {
    id: string;
    name: string;
  };
  agency?: Agency;
  branch?: {
    id: string;
    name: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, access: string, refresh: string) => Promise<void>;
  logout: () => Promise<void>;
  setOnboarded: (status: boolean) => Promise<void>;
  refreshProfile: () => Promise<void>;
  refresh: () => Promise<string | null>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  init: async () => {
    try {
      const authData = await db.settings.get("auth-session");
      if (authData?.value) {
        const { user, token, refreshToken } = authData.value;
        
        // 1. Immediately restore state from Dexie to enable "Fast Path"
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: !!token,
        });

        if (token) {
          // 2. Optimization: If already onboarded according to Dexie, 
          // we unblock the UI immediately and refresh in background.
          if (user?.is_onboarded) {
            set({ isLoading: false });
            // Background refresh for critical checks (subscription, frozen status)
            get().refreshProfile();
            return;
          }

          // 3. If not onboarded, verify and handle expired tokens
          try {
            const res = await fetch(getApiUrl(`${CONFIG.API.USERS.BASE}users/me/`), {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
              const updatedUser = await res.json();
              await get().login(updatedUser, token, refreshToken);
            } else if (res.status === 401) {
              const newToken = await get().refresh();
              if (newToken) {
                const retryRes = await fetch(getApiUrl(`${CONFIG.API.USERS.BASE}users/me/`), {
                  headers: { Authorization: `Bearer ${newToken}` },
                });
                if (retryRes.ok) {
                  const updatedUser = await retryRes.json();
                  await get().login(updatedUser, newToken, refreshToken);
                }
              } else {
                await get().logout();
              }
            }
          } catch (e) {
            console.error("Onboarding verification failed during init:", e);
          }
        }
      }
      set({ isLoading: false });
    } catch (error) {
      console.error("Failed to initialize auth from Dexie:", error);
      set({ isLoading: false });
    }
  },

  refreshProfile: async () => {
    const { token, refreshToken } = get();
    if (!token) return;

    try {
      const res = await fetch(getApiUrl(`${CONFIG.API.USERS.BASE}users/me/`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const updatedUser = await res.json();
        await get().login(updatedUser, token, refreshToken!);
      } else if (res.status === 401) {
        await get().refresh();
      }
    } catch (e) {
      console.error("Failed to refresh profile:", e);
    }
  },

  refresh: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return null;

    try {
      const res = await fetch(getApiUrl(CONFIG.API.AUTH.REFRESH), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        const { access } = data;
        const currentUser = get().user;
        if (currentUser) {
          await get().login(currentUser, access, refreshToken);
        }
        return access;
      }
    } catch (e) {
      console.error("Token refresh failed:", e);
    }
    return null;
  },

  login: async (user, access, refresh) => {
    const session = { user, token: access, refreshToken: refresh };
    await db.settings.put({ id: "auth-session", value: session });
    set({
      user,
      token: access,
      refreshToken: refresh,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    await db.settings.delete("auth-session");
    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  setOnboarded: async (status) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, is_onboarded: status };
      const session = await db.settings.get("auth-session");
      if (session) {
        session.value.user = updatedUser;
        await db.settings.put(session);
      }
      set({ user: updatedUser });
    }
  },
}));

// Auto-initialize
if (typeof window !== "undefined") {
  useAuthStore.getState().init();
}
