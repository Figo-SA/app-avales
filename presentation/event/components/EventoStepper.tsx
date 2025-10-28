import { ThemedText } from "@/presentation/theme/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";

type EstadoEvento = "disponible" | "solicitado" | "aceptado" | "rechazado";

interface EventoStepperProps {
  estado: EstadoEvento;
}

export const EventoStepper = ({ estado }: EventoStepperProps) => {
  const theme = useTheme();

  // Determinar qué pasos están activos/completados
  const getStepStatus = (stepNumber: number) => {
    switch (estado) {
      case "disponible":
        return stepNumber === 1 ? "active" : "pending";
      case "solicitado":
        return stepNumber === 1
          ? "completed"
          : stepNumber === 2
          ? "active"
          : "pending";
      case "aceptado":
        return stepNumber <= 3 ? "completed" : "active";
      case "rechazado":
        return stepNumber === 1 ? "completed" : "rejected";
      default:
        return "pending";
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50"; // Verde
      case "active":
        return "#2196F3"; // Azul
      case "rejected":
        return "#F44336"; // Rojo
      default:
        return "#E0E0E0"; // Gris
    }
  };

  const getStepIcon = (stepNumber: number, status: string) => {
    if (status === "completed") return "checkmark";
    if (status === "rejected") return "close";
    if (status === "active") {
      switch (stepNumber) {
        case 1:
          return "paper-plane";
        case 2:
          return "hourglass";
        case 3:
          return "checkmark-done";
        case 4:
          return "document-text";
        default:
          return "ellipse";
      }
    }
    return "ellipse-outline";
  };

  const steps = [
    { number: 1, label: "Solicitar" },
    { number: 2, label: "Revisar" },
    { number: 3, label: "Aprobar" },
    { number: 4, label: "Aval" },
  ];

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          const color = getStepColor(status);

          return (
            <React.Fragment key={step.number}>
              {/* Step Circle */}
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    {
                      backgroundColor: color,
                      borderColor: color,
                    },
                  ]}
                >
                  <Icon
                    source={getStepIcon(step.number, status)}
                    size={10}
                    color="#FFFFFF"
                  />
                </View>
                <ThemedText
                  style={[
                    styles.stepLabel,
                    {
                      color:
                        status === "active" || status === "completed"
                          ? theme.colors.onSurface
                          : theme.colors.onSurfaceDisabled,
                      fontWeight: status === "active" ? "700" : "500",
                    },
                  ]}
                >
                  {step.label}
                </ThemedText>
              </View>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    {
                      backgroundColor:
                        status === "completed"
                          ? getStepColor("completed")
                          : "#E0E0E0",
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Mensaje contextual */}
      <View style={styles.messageContainer}>
        {estado === "disponible" && (
          <ThemedText style={styles.messageText}>
            📤 Envía tu solicitud para comenzar
          </ThemedText>
        )}
        {estado === "solicitado" && (
          <ThemedText style={styles.messageText}>
            ⏳ Esperando revisión del administrador...
          </ThemedText>
        )}
        {estado === "aceptado" && (
          <ThemedText style={[styles.messageText, styles.messageSuccess]}>
            ✅ ¡Aprobado! Ahora agrega tus jugadores
          </ThemedText>
        )}
        {estado === "rechazado" && (
          <ThemedText style={[styles.messageText, styles.messageError]}>
            ❌ Solicitud rechazada
          </ThemedText>
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      gap: 6,
    },
    stepsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    stepItem: {
      alignItems: "center",
      gap: 4,
      flex: 1,
    },
    stepCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      justifyContent: "center",
      alignItems: "center",
    },
    stepLabel: {
      fontSize: 9,
      textAlign: "center",
      letterSpacing: 0.1,
    },
    connector: {
      height: 1.5,
      width: 12,
      marginBottom: 12,
    },
    messageContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
    },
    messageText: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
      fontWeight: "500",
      lineHeight: 14,
    },
    messageSuccess: {
      color: "#4CAF50",
      fontWeight: "700",
    },
    messageError: {
      color: "#F44336",
      fontWeight: "700",
    },
  });
