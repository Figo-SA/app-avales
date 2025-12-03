import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
          tabBarStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.onPrimary,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
        }}
      >
        <Tabs.Screen
          name="event"
          options={{
            title: "Explorar",
            headerTitle: "Explorar Eventos",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={focused ? 26 : 22}
                name={focused ? "compass" : "compass-outline"}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            title: "Mis Solicitudes",
            headerTitle: "Mis Solicitudes",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                size={focused ? 26 : 22}
                name={focused ? "file-tray-full" : "file-tray-full-outline"}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            headerTitle: "Mi Perfil",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons size={focused ? 26 : 22} name="person" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
