import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";
import { useThemeStore } from "../store/useThemeStore";

export const useAppTheme = () => {
  const theme = useTheme();
  const systemColorScheme = useColorScheme();
  const { themeMode, isDarkMode, setIsDarkMode, loadThemeFromStorage } =
    useThemeStore();

  // Load theme preference on first load
  useEffect(() => {
    loadThemeFromStorage();
  }, [loadThemeFromStorage]);

  // Update isDarkMode based on themeMode and system preference
  useEffect(() => {
    let shouldBeDark = false;

    if (themeMode === "system") {
      shouldBeDark = systemColorScheme === "dark";
    } else {
      shouldBeDark = themeMode === "dark";
    }

    if (isDarkMode !== shouldBeDark) {
      setIsDarkMode(shouldBeDark);
    }
  }, [themeMode, systemColorScheme, isDarkMode, setIsDarkMode]);

  return {
    theme,
    isDark: isDarkMode,
    colors: theme.colors,
    themeMode,
    isSystemTheme: themeMode === "system",
  };
};
