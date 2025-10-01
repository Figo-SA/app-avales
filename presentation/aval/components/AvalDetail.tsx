import { getStatusConfig } from "@/core/avales/helpers/statusHelper";
import { Aval } from "@/core/avales/interfaces/aval";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  Text,
  useTheme,
} from "react-native-paper";

interface AvalDetailProps {
  aval: Aval;
}

export const AvalDetail = ({ aval }: AvalDetailProps) => {
  const theme = useTheme();
  const statusConfig = getStatusConfig(aval.status);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          {/* Título como protagonista */}
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {aval.title}
          </Text>

          <Divider style={{ marginVertical: 16 }} />

          <View style={styles.header}>
            <View style={styles.infoContainer}>
              <Text
                variant="bodyMedium"
                style={[
                  styles.amountLabel,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Monto solicitado
              </Text>
              <Text
                variant="titleLarge"
                style={[styles.amount, { color: theme.colors.onSurface }]}
              >
                ${aval.amount}
              </Text>
              <Text
                variant="bodyMedium"
                style={[styles.date, { color: theme.colors.onSurfaceVariant }]}
              >
                Creado el{" "}
                {new Date(aval.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </View>

            <Chip
              icon={statusConfig.icon}
              style={{
                backgroundColor: `${statusConfig.color}15`,
                borderColor: statusConfig.color,
                borderWidth: 1,
              }}
              textStyle={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </Chip>
          </View>

          <Divider style={{ marginVertical: 16 }} />

          <Text
            variant="bodyMedium"
            style={[
              styles.descriptionLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Descripción
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.description, { color: theme.colors.onSurface }]}
          >
            {aval.description}
          </Text>
        </Card.Content>
      </Card>

      {/* Progress Steps */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={[{ marginBottom: 16, color: theme.colors.onSurface }]}
          >
            Estado del proceso
          </Text>

          <View style={styles.stepsContainer}>
            <View style={styles.stepsRow}>
              {/* Paso 1: Enviado */}
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor:
                        statusConfig.step >= 1
                          ? statusConfig.color
                          : theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      {
                        color:
                          statusConfig.step >= 1
                            ? theme.colors.onPrimary
                            : theme.colors.onSurfaceVariant,
                      },
                    ]}
                  >
                    1
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Enviado
                </Text>
              </View>

              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor:
                      statusConfig.step >= 2
                        ? statusConfig.color
                        : theme.colors.surfaceVariant,
                  },
                ]}
              />

              {/* Paso 2: En revisión */}
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor:
                        statusConfig.step >= 2
                          ? statusConfig.color
                          : theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      {
                        color:
                          statusConfig.step >= 2
                            ? theme.colors.onPrimary
                            : theme.colors.onSurfaceVariant,
                      },
                    ]}
                  >
                    2
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  En revisión
                </Text>
              </View>

              <View
                style={[
                  styles.stepLine,
                  {
                    backgroundColor:
                      statusConfig.step >= 3
                        ? statusConfig.color
                        : theme.colors.surfaceVariant,
                  },
                ]}
              />

              {/* Paso 3: Estado final */}
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor:
                        statusConfig.step >= 3
                          ? statusConfig.color
                          : theme.colors.surfaceVariant,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.stepNumber,
                      {
                        color:
                          statusConfig.step >= 3
                            ? theme.colors.onPrimary
                            : theme.colors.onSurfaceVariant,
                      },
                    ]}
                  >
                    3
                  </Text>
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {aval.status === "approved"
                    ? "Aceptado"
                    : aval.status === "rejected"
                    ? "Rechazado"
                    : "Finalizado"}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Button
          mode="outlined"
          onPress={() => {
            // Acción de compartir
          }}
          style={styles.actionButton}
        >
          Compartir
        </Button>

        <Button
          mode="contained"
          onPress={() => {
            // Acción principal
          }}
          style={styles.actionButton}
        >
          Descargar PDF
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  amount: {
    fontWeight: "600",
    marginBottom: 8,
  },
  date: {
    fontSize: 13,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  description: {
    lineHeight: 24,
  },
  stepsContainer: {
    marginTop: 12,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
  stepLine: {
    height: 3,
    flex: 0.4,
    marginHorizontal: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});
