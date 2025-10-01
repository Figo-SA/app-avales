import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

interface AvalFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  counts: {
    all: number;
    sent: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const AvalFilters = ({
  selectedStatus,
  onStatusChange,
  counts,
}: AvalFiltersProps) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Chip
          compact
          selected={selectedStatus === "all"}
          onPress={() => onStatusChange("all")}
          mode="outlined"
          style={[
            styles.chip,
            selectedStatus === "all" && {
              backgroundColor: `${theme.colors.primary}15`, // 15% opacity
              borderColor: theme.colors.primary,
            },
          ]}
          textStyle={[
            styles.chipText,
            selectedStatus === "all" && { color: theme.colors.primary },
          ]}
        >
          Todos
        </Chip>

        <Chip
          selected={selectedStatus === "sent"}
          onPress={() => onStatusChange("sent")}
          mode="outlined"
          style={[
            styles.chip,
            selectedStatus === "sent" && {
              backgroundColor: `${theme.colors.primary}15`,
              borderColor: theme.colors.primary,
            },
          ]}
          textStyle={[
            styles.chipText,
            selectedStatus === "sent" && { color: theme.colors.primary },
          ]}
        >
          Enviados {counts.sent > 0 && counts.sent}
        </Chip>

        <Chip
          selected={selectedStatus === "pending"}
          onPress={() => onStatusChange("pending")}
          mode="outlined"
          style={[
            styles.chip,
            selectedStatus === "pending" && {
              backgroundColor: "#FF980015", // Naranja suave
              borderColor: "#FF9800",
            },
          ]}
          textStyle={[
            styles.chipText,
            selectedStatus === "pending" && { color: "#FF9800" },
          ]}
        >
          En revisión {counts.pending > 0 && counts.pending}
        </Chip>

        <Chip
          selected={selectedStatus === "approved"}
          onPress={() => onStatusChange("approved")}
          mode="outlined"
          style={[
            styles.chip,
            selectedStatus === "approved" && {
              backgroundColor: "#4CAF5015", // Verde suave
              borderColor: "#4CAF50",
            },
          ]}
          textStyle={[
            styles.chipText,
            selectedStatus === "approved" && { color: "#4CAF50" },
          ]}
        >
          Aceptados {counts.approved > 0 && counts.approved}
        </Chip>

        <Chip
          selected={selectedStatus === "rejected"}
          onPress={() => onStatusChange("rejected")}
          mode="outlined"
          style={[
            styles.chip,
            selectedStatus === "rejected" && {
              backgroundColor: "#F4433615", // Rojo suave
              borderColor: "#F44336",
            },
          ]}
          textStyle={[
            styles.chipText,
            selectedStatus === "rejected" && { color: "#F44336" },
          ]}
        >
          Rechazados {counts.rejected > 0 && counts.rejected}
        </Chip>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollContent: {
    gap: 8,
    alignItems: "center", // Centra verticalmente los chips
  },
  chip: {
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
