import { logger } from "@/core/logger";
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";
import { create } from "zustand";

type ThemeMode = "light" | "dark" | "system";

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  loadThemeFromStorage: () => Promise<void>;
}

const THEME_STORAGE_KEY = "user-theme-preference";

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: "system",
  isDarkMode: false,

  setThemeMode: async (mode: ThemeMode) => {
    set({ themeMode: mode });

    try {
      await SecureStorageAdapter.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({ themeMode: mode })
      );
    } catch (error) {
      logger.warn("Failed to save theme preference:", error);
    }
  },

  toggleTheme: async () => {
    const { isDarkMode } = get();
    const newMode: ThemeMode = isDarkMode ? "light" : "dark";
    set({
      themeMode: newMode,
      isDarkMode: !isDarkMode,
    });

    try {
      await SecureStorageAdapter.setItem(
        THEME_STORAGE_KEY,
        JSON.stringify({ themeMode: newMode })
      );
    } catch (error) {
      logger.warn("Failed to save theme preference:", error);
    }
  },

  setIsDarkMode: (isDark: boolean) => {
    set({ isDarkMode: isDark });
  },

  loadThemeFromStorage: async () => {
    try {
      const stored = await SecureStorageAdapter.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const { themeMode } = JSON.parse(stored);
        set({ themeMode });
      }
    } catch (error) {
      logger.warn("Failed to load theme preference:", error);
    }
  },
}));
