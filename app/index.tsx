import { ROLES } from "@/core/auth/constants/roles";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { status, checkStatus, user } = useAuthStore();

  useEffect(() => {
    checkStatus();
  }, []);

  if (status === "checking") {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (status === "unauthenticated") {
    return <Redirect href="/auth/login" />;
  }

  if (status === "authenticated" && user) {
    const userRole = user.roles?.[0]; // Asumiendo que el usuario tiene al menos un rol y tomamos el primero principal
    
    switch (userRole) {
      case ROLES.ADMIN:
      case ROLES.SUPER_ADMIN:
        return <Redirect href={"/(admin)" as any} />;
      case ROLES.DTM:
      case ROLES.DTM_EIDE:
        return <Redirect href={"/(dtm)" as any} />;
      case ROLES.ENTRENADOR:
        console.log("REEDIRECCIONANDO A ENTRENADOR");
        return <Redirect href={"/(entrenador)" as any} />;
      default:
        return <Redirect href={"/(entrenador)" as any} />;
    }
  }

  return null;
}
