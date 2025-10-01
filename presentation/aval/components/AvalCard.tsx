import { getStatusConfig } from "@/core/avales/helpers/statusHelper";
import { Aval } from "@/core/avales/interfaces/aval";
import { router } from "expo-router";
import React, { Fragment } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Card, Chip, Text, useTheme } from "react-native-paper";

export const AvalCard = ({ aval }: { aval: Aval }) => {
  const statusConfig = getStatusConfig(aval.status);
  const theme = useTheme();
  const handlePress = () => {
    router.push(`/(avales-app)/aval/${aval.id}`);
  };

  return (
    <Pressable onPress={handlePress}>
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text
                variant="titleLarge"
                style={[styles.title, { color: theme.colors.onSurface }]}
              >
                {aval.title}
              </Text>
              <Text
                variant="bodyLarge"
                style={[
                  styles.amount,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                ${aval.amount}
              </Text>
            </View>
            <View style={styles.statusContainer}>
              <Chip
                icon={statusConfig.icon}
                textStyle={{ fontSize: 12 }}
                style={{
                  backgroundColor: `${statusConfig.color}15`,
                  borderColor: statusConfig.color,
                  borderWidth: 1,
                  minWidth: 100,
                  justifyContent: "center",
                }}
                compact={true}
              >
                {statusConfig.label}
              </Chip>
              <Text
                variant="bodySmall"
                style={[styles.date, { color: theme.colors.onSurfaceVariant }]}
              >
                {new Date(aval.createdAt).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          <Text
            variant="bodyMedium"
            style={[
              styles.description,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {aval.description}
          </Text>

          <View style={styles.stepsContainer}>
            <View style={styles.stepsRow}>
              {[1, 2, 3].map((step) => (
                <Fragment key={step}>
                  {step > 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        {
                          backgroundColor:
                            step <= statusConfig.step
                              ? statusConfig.color
                              : theme.colors.surfaceVariant,
                        },
                      ]}
                    />
                  )}
                  <View style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepCircle,
                        {
                          backgroundColor:
                            step <= statusConfig.step
                              ? statusConfig.color
                              : theme.colors.surfaceVariant,
                        },
                        step <= statusConfig.step && styles.stepActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepNumber,
                          {
                            color:
                              step <= statusConfig.step
                                ? theme.colors.onPrimary
                                : theme.colors.onSurfaceVariant,
                          },
                        ]}
                      >
                        {step}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        { color: theme.colors.onSurfaceVariant },
                      ]}
                    >
                      {step === 1
                        ? "Enviado"
                        : step === 2
                        ? "En revisión"
                        : step === 3 && aval.status === "approved"
                        ? "Aceptado"
                        : step === 3 && aval.status === "rejected"
                        ? "Rechazado"
                        : "Finalizado"}
                    </Text>
                  </View>
                </Fragment>
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 18,
  },
  amount: {
    fontWeight: "600",
    fontSize: 16,
  },
  statusContainer: {
    alignItems: "flex-end",
  },
  date: {
    marginTop: 4,
    fontSize: 11,
  },
  description: {
    marginBottom: 12,
    lineHeight: 20,
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
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepActive: {
    elevation: 2,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 10,
    textAlign: "center",
  },
  stepLine: {
    height: 2,
    flex: 0.3,
    marginHorizontal: 4,
  },
});
