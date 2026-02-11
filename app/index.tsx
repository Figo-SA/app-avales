import { ROLES } from "@/core/auth/constants/roles";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { Redirect } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { status, checkStatus, user } = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      hasChecked.current = true;
      checkStatus();
    }
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
    const userRole = user.roles?.[0];

    switch (userRole) {
      case ROLES.ADMIN:
      case ROLES.SUPER_ADMIN:
        return <Redirect href={"/(protected)/(admin)" as any} />;
      case ROLES.DTM:
        return <Redirect href={"/(protected)/(dtm)" as any} />;
      case ROLES.PDA:
        return <Redirect href={"/(protected)/(pda)" as any} />;
      case ROLES.COMPRAS_PUBLICAS:
        return <Redirect href={"/(protected)/(compras-publicas)" as any} />;
      case ROLES.CONTROL_PREVIO:
        return <Redirect href={"/(protected)/(control-previo)" as any} />;
      case ROLES.SECRETARIA:
        return <Redirect href={"/(protected)/(secretaria)" as any} />;
      case ROLES.FINANCIERO:
        return <Redirect href={"/(protected)/(financiero)" as any} />;
      case ROLES.METODOLOGO:
        return <Redirect href={"/(protected)/(metodologo)" as any} />;
      case ROLES.ENTRENADOR:
      default:
        return <Redirect href={"/(protected)/(entrenador)" as any} />;
    }
  }

  return null;
}
