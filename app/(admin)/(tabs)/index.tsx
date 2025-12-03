import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Text } from "react-native-paper";

export default function AdminDashboard() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text variant="headlineMedium" style={{ fontWeight: "bold", marginBottom: 10 }}>
        Panel de Administrador
      </Text>
      <Text variant="bodyLarge" style={{ textAlign: "center" }}>
        Aquí verás gráficas y estadísticas del sistema.
      </Text>
    </ThemedView>
  );
}
