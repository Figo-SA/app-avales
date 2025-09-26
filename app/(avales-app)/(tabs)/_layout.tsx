import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useRef } from "react";
import { Animated, Platform, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const theme = useTheme();
  const router = useRouter();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handleAddPress = () => {
    // Animación de pulso
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Navegar al modal en lugar del tab
    router.push("/(avales-app)/nuevo-aval");
  };

  const FloatingAddButton = () => (
    <Animated.View
      style={{
        position: "absolute",
        // Centrar el botón flotante entre los dos tabs
        bottom: Platform.OS === "ios" ? 25 : 25,
        left: "50%",
        marginLeft: -40, // Centrar correctamente (80/2)
        transform: [{ scale: scaleValue }],
        zIndex: 1000,
      }}
    >
      <TouchableOpacity
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: theme.colors.primary,
          justifyContent: "center",
          alignItems: "center",
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          borderWidth: 4, // Necesario para que funcione borderColor
          borderColor: theme.colors.surface,
        }}
        onPress={handleAddPress}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color={theme.colors.onPrimary} />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.onSurfaceVariant,

          tabBarStyle: {
            backgroundColor: theme.colors.surface,
            borderTopWidth: 0,
            paddingBottom: Platform.OS === "ios" ? 20 : 15,
            elevation: 12,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          },

          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
            marginTop: 2,
          },

          headerStyle: {
            backgroundColor: theme.colors.primary,
            elevation: 0,
            shadowOpacity: 0,
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

      <FloatingAddButton />
    </>
  );
}
