import { APPROVAL_STAGE_FLOW, type EtapaFlujo } from "@/core/constants/avales.constants";
import { ThemedText } from "@/presentation/theme/components/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ProgressBar, useTheme } from "react-native-paper";

interface EventoStepperProps {
  estado: string;
  etapa?: EtapaFlujo | string;
}

const STEP_LABELS: Record<string, string> = {
  SOLICITUD: "Solicitud",
  PDA: "PDA",
  REVISION_METODOLOGO: "Metodólogo",
  REVISION_DTM: "DTM",
  CONTROL_PREVIO: "Control Previo",
  SECRETARIA: "Secretaría",
  FINANCIERO: "Financiero",
  COMPRAS_PUBLICAS: "Compras Públicas",
};

export const EventoStepper = ({ estado, etapa }: EventoStepperProps) => {
  const theme = useTheme();
  const estadoUpper = estado?.toUpperCase() || "SOLICITADO";
  const totalStages = APPROVAL_STAGE_FLOW.length;

  const currentStageIndex = etapa
    ? APPROVAL_STAGE_FLOW.indexOf(etapa as EtapaFlujo)
    : 0;

  const currentLabel = etapa ? (STEP_LABELS[etapa as string] || etapa) : STEP_LABELS.SOLICITUD;

  const getProgressColor = () => {
    if (estadoUpper === "ACEPTADO") return "#10B981";
    if (estadoUpper === "RECHAZADO") return "#EF4444";
    return "#3B82F6";
  };

  const getProgress = () => {
    if (estadoUpper === "ACEPTADO") return 1;
    return (currentStageIndex + 1) / totalStages;
  };

  const getStatusMessage = () => {
    if (estadoUpper === "ACEPTADO") return "Solicitud aprobada";
    if (estadoUpper === "RECHAZADO") return "Solicitud rechazada";
    return "En revisión";
  };

  const progressColor = getProgressColor();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ProgressBar
        progress={getProgress()}
        color={progressColor}
        style={styles.progressBar}
      />
      <View style={styles.labelRow}>
        <ThemedText
          style={[
            styles.stageText,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Etapa {currentStageIndex + 1}/{totalStages} · {currentLabel}
        </ThemedText>
      </View>
      <View style={[styles.messageContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <ThemedText
          style={[
            styles.messageText,
            { color: estadoUpper === "ACEPTADO" ? "#10B981" : estadoUpper === "RECHAZADO" ? "#EF4444" : theme.colors.onSurfaceVariant },
            (estadoUpper === "ACEPTADO" || estadoUpper === "RECHAZADO") && styles.messageBold,
          ]}
        >
          {getStatusMessage()}
        </ThemedText>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      gap: 6,
    },
    progressBar: {
      height: 6,
      borderRadius: 3,
      backgroundColor: theme.dark ? "#4B5563" : "#E5E7EB",
    },
    labelRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    stageText: {
      fontSize: 12,
      fontWeight: "500",
    },
    messageContainer: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
    },
    messageText: {
      fontSize: 11,
      textAlign: "center",
      fontWeight: "500",
      lineHeight: 14,
    },
    messageBold: {
      fontWeight: "700",
    },
  });
