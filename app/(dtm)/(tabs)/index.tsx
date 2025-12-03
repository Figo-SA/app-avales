import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Text } from "react-native-paper";

export default function DtmDashboard() {
  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text variant="headlineMedium" style={{ fontWeight: "bold", marginBottom: 10 }}>
        Panel DTM
      </Text>
      <Text variant="bodyLarge" style={{ textAlign: "center" }}>
        Vista exclusiva para el rol DTM.
      </Text>
    </ThemedView>
  );
}
