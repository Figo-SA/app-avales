// React y React Native
import { StatusBar, useColorScheme } from "react-native"; // Hook nativo

// Navegación
import { Stack } from "expo-router";

// Gesture Handler
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Paper UI + Adaptador de temas
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

// Iconos
import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";

// Utilidades de terceros
import { Toasts } from "@backpackapp-io/react-native-toast";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
// Constantes del proyecto
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Colors } from "../constants/Colors";
import { useThemeStore } from "../presentation/theme/store/useThemeStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { theme } = useMaterial3Theme();
  const { themeMode, isDarkMode, setIsDarkMode, loadThemeFromStorage } =
    useThemeStore();

  // Load theme preference on app start
  useEffect(() => {
    loadThemeFromStorage();
  }, [loadThemeFromStorage]);

  // Update theme based on user preference and system theme
  useEffect(() => {
    if (themeMode === "system") {
      setIsDarkMode(systemColorScheme === "dark");
    } else {
      setIsDarkMode(themeMode === "dark");
    }
  }, [themeMode, systemColorScheme, setIsDarkMode]);

  const customDarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...theme.dark,
      ...Colors.dark,
    },
  };

  const customLightTheme = {
    ...MD3LightTheme,
    colors: {
      ...theme.light,
      ...Colors.light,
    },
  };
  const paperTheme = isDarkMode ? customDarkTheme : customLightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider
        theme={paperTheme}
        settings={{
          icon: ({ name, size, color }) => {
            // Detectar familia por prefijo: "ion:", "mc:", "fe:"
            if (name?.startsWith("ion:")) {
              return (
                <Ionicons
                  name={name.replace("ion:", "") as any}
                  size={size}
                  color={color}
                />
              );
            } else if (name?.startsWith("fa:")) {
              return (
                <FontAwesome5
                  name={name.replace("fa:", "") as any}
                  size={size}
                  color={color}
                />
              );
            } else if (name?.startsWith("fe:")) {
              return (
                <Feather
                  name={name.replace("fe:", "") as any}
                  size={size}
                  color={color}
                />
              );
            }

            return <Ionicons name={name as any} size={size} color={color} />;
          },
        }}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Toasts />
          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={
              isDarkMode
                ? customDarkTheme.colors.background
                : customLightTheme.colors.background
            }
          />
          <Stack screenOptions={{ headerShown: false }} />
          <Toasts />
        </GestureHandlerRootView>
      </PaperProvider>
    </QueryClientProvider>
  );
}
