// React y React Native
import { Platform, StatusBar, useColorScheme } from "react-native"; // Hook nativo

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
// Constantes del proyecto
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Colors } from "../constants/Colors";
import { useThemeStore } from "../presentation/theme/store/useThemeStore";

// --- INICIO: NUEVOS IMPORTS ---
import * as ExpoDevice from "expo-device";
import { useSyncQueriesExternal } from "react-query-external-sync";
// --- FIN: NUEVOS IMPORTS ---

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// 1. Mueve toda tu lógica a este nuevo componente interno
function RootLayoutContent() {
  const systemColorScheme = useColorScheme();
  const { themeMode, isDarkMode, setIsDarkMode, loadThemeFromStorage } =
    useThemeStore();

  // --- INICIO: HOOK DE RN-BETTER-DEV-TOOLS ---
  // Lo envolvemos en __DEV__ para que solo se ejecute en desarrollo
  if (__DEV__) {
    useSyncQueriesExternal({
      queryClient,
      socketURL: "http://localhost:42831", // Puerto por defecto
      deviceName: ExpoDevice.deviceName || Platform.OS,
      platform: Platform.OS,
      // Usamos un ID de dispositivo persistente para evitar conexiones duplicadas
      deviceId: ExpoDevice.osInternalBuildId || "unknown-device",
      isDevice: ExpoDevice.isDevice,
    });
  }
  // --- FIN: HOOK DE RN-BETTER-DEV-TOOLS ---

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
      ...MD3DarkTheme.colors,
      ...Colors.dark,
    },
  };

  const customLightTheme = {
    ...MD3LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...Colors.light,
    },
  };
  const paperTheme = isDarkMode ? customDarkTheme : customLightTheme;

  // Tu JSX original ahora va aquí
  return (
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
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(protected)" />
          <Stack.Screen name="auth" />
        </Stack>
        <Toasts />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}

// 2. Tu RootLayout ahora solo provee el cliente y renderiza el contenido
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutContent />
    </QueryClientProvider>
  );
}
