import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
          name="index"
          options={{
            title: "Avales",
            headerTitle: "Mis Avales",
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons
                size={focused ? 28 : 24}
                name="description"
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
