import { create } from "zustand";
import { db } from "../db/db";

interface ThemeState {
  mode: "light" | "dark";
  isInitialized: boolean;
  toggleMode: () => void;
  setMode: (mode: "light" | "dark") => void;
  init: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "light", // Default is light as requested
  isInitialized: false,
  
  init: async () => {
    try {
      const themeSetting = await db.settings.get("theme-mode");
      const savedMode = themeSetting?.value;
      
      // If we have a saved mode, use it. Otherwise, stay light (default).
      if (savedMode === "dark" || savedMode === "light") {
        get().setMode(savedMode);
      } else {
        // Fallback to light mode if nothing is in DB
        get().setMode("light");
      }
      set({ isInitialized: true });
    } catch (error) {
      console.error("Failed to initialize theme from Dexie:", error);
      set({ isInitialized: true });
    }
  },

  toggleMode: () => {
    const newMode = get().mode === "light" ? "dark" : "light";
    get().setMode(newMode);
  },

  setMode: (mode) => {
    // Apply class to document
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Save to Dexie
    db.settings.put({ id: "theme-mode", value: mode });
    
    // Save to localStorage as a sync fallback for index.html script
    localStorage.setItem("gonza-theme-mode", JSON.stringify(mode));
    
    set({ mode });
  },
}));

// Auto-initialize
if (typeof window !== "undefined") {
  useThemeStore.getState().init();
}
