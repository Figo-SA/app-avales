import { Participante } from "@/core/participants/interfaces/participante";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Divider, Icon, ProgressBar, Surface, Text, useTheme } from "react-native-paper";

interface CategoriaSectionProps {
  titulo: string;
  icono: string;
  color: string;
  progreso: { actual: number; requerido: number; porcentaje: number };
  participantes: Participante[];
  onAgregar: () => void;
  onEliminar: (id: string) => void;
}

export const CategoriaSection: React.FC<CategoriaSectionProps> = ({
  titulo,
  icono,
  color,
  progreso,
  participantes,
  onAgregar,
  onEliminar,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.categoriaSection}>
      <View style={styles.categoriaHeader}>
        <View style={styles.categoriaTitle}>
          <Icon source={icono} size={20} color={color} />
          <Text variant="titleMedium" style={styles.categoriaTitleText}>
            {titulo}
          </Text>
        </View>
        <View style={styles.categoriaCounter}>
          <Text variant="bodyMedium" style={{ color }}>
            {progreso.actual}/{progreso.requerido}
          </Text>
        </View>
      </View>

      <ProgressBar
        progress={progreso.porcentaje}
        color={color}
        style={styles.progressBar}
      />

      {participantes.length > 0 && (
        <View style={styles.participantesList}>
          {participantes.map((participante) => (
            <Surface key={participante.id} style={styles.participanteCard} elevation={1}>
              <View style={styles.participanteInfo}>
                <Text variant="bodyMedium" style={styles.participanteNombre}>
                  {participante.nombres} {participante.apellidos}
                </Text>
                <Text variant="bodySmall" style={styles.participanteCedula}>
                  CI: {participante.cedula}
                </Text>
              </View>
              <ThemeButton
                mode="text"
                onPress={() => onEliminar(participante.id)}
                textColor={theme.colors.error}
                compact
              >
                Eliminar
              </ThemeButton>
            </Surface>
          ))}
        </View>
      )}

      {progreso.actual < progreso.requerido && (
        <ThemeButton
          mode="outlined"
          icon="ion:add"
          onPress={onAgregar}
          style={styles.agregarButton}
        >
          {`Agregar ${titulo.toLowerCase()}`}
        </ThemeButton>
      )}

      {progreso.actual >= progreso.requerido && (
        <Surface style={styles.completoCard} elevation={0}>
          <Icon source="ion:checkmark-circle" size={16} color="#4CAF50" />
          <Text variant="bodySmall" style={styles.completoText}>
            Completo
          </Text>
        </Surface>
      )}

      <Divider style={styles.divider} />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    categoriaSection: {
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    categoriaHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    categoriaTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    categoriaTitleText: {
      fontWeight: "600",
      color: theme.colors.onSurface,
    },
    categoriaCounter: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceVariant,
    },
    progressBar: {
      height: 8,
      borderRadius: 4,
      marginBottom: 12,
    },
    participantesList: {
      gap: 8,
      marginBottom: 12,
    },
    participanteCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    participanteInfo: {
      flex: 1,
    },
    participanteNombre: {
      fontWeight: "600",
      color: theme.colors.onSurface,
      marginBottom: 2,
    },
    participanteCedula: {
      color: theme.colors.onSurfaceVariant,
    },
    agregarButton: {
      marginBottom: 8,
    },
    completoCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      padding: 8,
      borderRadius: 8,
      backgroundColor: "#4CAF5015",
      marginBottom: 8,
    },
    completoText: {
      color: "#4CAF50",
      fontWeight: "600",
    },
    divider: {
      marginVertical: 16,
    },
  });
