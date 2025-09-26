import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

export default function ListaAvalesScreen() {
  const theme = useTheme();

  // Datos de ejemplo - aquí conectarías con tu store/API
  const avales = [
    {
      id: 1,
      nombreEvento: "Campeonato Nacional de Natación",
      disciplina: "Natación",
      fecha: "2024-03-15",
      estado: "Aprobado",
    },
    {
      id: 2,
      nombreEvento: "Torneo Regional de Atletismo",
      disciplina: "Atletismo",
      fecha: "2024-04-20",
      estado: "Pendiente",
    },
    {
      id: 3,
      nombreEvento: "Copa Internacional de Fútbol",
      disciplina: "Fútbol",
      fecha: "2024-05-10",
      estado: "En Revisión",
    },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Aprobado":
        return theme.colors.primary;
      case "Pendiente":
        return theme.colors.tertiary;
      case "En Revisión":
        return theme.colors.secondary;
      default:
        return theme.colors.outline;
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {avales.length === 0 ? (
          <View style={styles.emptyState}>
            <Text
              variant="headlineSmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              No tienes avales registrados
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
            >
              Presiona el botón + para crear tu primer aval
            </Text>
          </View>
        ) : (
          avales.map((aval) => (
            <Card
              key={aval.id}
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface, flex: 1 }}
                  >
                    {aval.nombreEvento}
                  </Text>
                  <View
                    style={[
                      styles.estadoBadge,
                      { backgroundColor: getEstadoColor(aval.estado) + "20" },
                    ]}
                  >
                    <Text variant="labelSmall" style={{ color: "#fff" }}>
                      {aval.estado}
                    </Text>
                  </View>
                </View>

                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
                >
                  {aval.disciplina}
                </Text>

                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}
                >
                  Fecha:{" "}
                  {new Date(aval.fecha).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Espacio para el botón flotante
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
});
