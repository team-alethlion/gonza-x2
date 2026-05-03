import { create } from "zustand";
import { db } from "../db/db";

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_onboarded: boolean;
  role?: string;
  agency?: string;
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
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: !!token,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to initialize auth from Dexie:", error);
      set({ isLoading: false });
    }
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
