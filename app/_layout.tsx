import { Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native"; // Usar el nativo
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import { Colors } from "../constants/Colors";

const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
const customLightTheme = { ...MD3LightTheme, colors: Colors.light };

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(LightTheme, customLightTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Usar el hook nativo

  const paperTheme =
    colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;

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

          // Por defecto, usa Ionicons
          return <Ionicons name={name as any} size={size} color={color} />;
        },
      }}
    >
      <ThemeProvider value={paperTheme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </GestureHandlerRootView>
      </ThemeProvider>
    </PaperProvider>
  );
}
