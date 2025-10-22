import { Skeleton } from "@/presentation/theme/components/Skeleton";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

export const EventoCardSkeleton: FC = () => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.pressable}>
      <ThemedView style={styles.card}>
        {/* Header con Título y Badge */}
        <View style={styles.header}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Skeleton width="85%" height={22} />
            <Skeleton width="70%" height={22} style={{ marginTop: 4 }} />
          </View>
          {/* Badge tipo evento */}
          <Skeleton width={70} height={28} borderRadius={12} />
        </View>

        {/* Contenido */}
        <View style={styles.content}>
          {/* Main Info: Deporte • Provincia • Alcance */}
          <View style={styles.mainInfo}>
            <Skeleton width={80} height={14} />
            <Skeleton
              width={4}
              height={4}
              borderRadius={2}
              style={{ marginHorizontal: 6 }}
            />
            <Skeleton width={100} height={14} />
            <Skeleton
              width={4}
              height={4}
              borderRadius={2}
              style={{ marginHorizontal: 6 }}
            />
            <Skeleton width={60} height={14} />
          </View>

          {/* Fechas */}
          <Skeleton width="60%" height={14} />

          {/* Separador */}
          <View style={styles.separator} />

          {/* Estadísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Skeleton width={16} height={16} borderRadius={8} />
              <Skeleton width={30} height={16} style={{ marginTop: 4 }} />
              <Skeleton width={50} height={12} style={{ marginTop: 2 }} />
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Skeleton width={16} height={16} borderRadius={8} />
              <Skeleton width={30} height={16} style={{ marginTop: 4 }} />
              <Skeleton width={70} height={12} style={{ marginTop: 2 }} />
            </View>
          </View>
        </View>
      </ThemedView>
    </View>
  );
};

/**
 * Lista de skeletons para mostrar durante carga inicial
 */
export const EventoListSkeleton: FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <EventoCardSkeleton key={index} />
      ))}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    pressable: {
      marginBottom: 12,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    content: {
      gap: 10,
    },
    mainInfo: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
    },
    separator: {
      height: 1,
      backgroundColor: "rgba(0, 0, 0, 0.08)",
      marginVertical: 4,
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      gap: 4,
    },
    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: "rgba(0, 0, 0, 0.08)",
      marginHorizontal: 12,
    },
    listContainer: {
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
  });

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
