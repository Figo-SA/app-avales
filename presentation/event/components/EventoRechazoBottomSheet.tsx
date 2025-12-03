import { Evento } from "@/core/eventos/interfaces/evento";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import { Divider, Icon, Text, useTheme } from "react-native-paper";

interface EventoRechazoBottomSheetProps {
  evento: Evento | null;
}

/**
 * Bottom Sheet que muestra el motivo de rechazo de un evento
 * y permite navegar a la solicitud para volver a intentar
 */
export const EventoRechazoBottomSheet = forwardRef<
  BottomSheet,
  EventoRechazoBottomSheetProps
>(({ evento }, ref) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleClose = () => {
    if (ref && typeof ref !== "function" && ref.current) {
      ref.current.close();
    }
  };

  const handleVolverSolicitar = () => {
    if (evento) {
      handleClose();
      // Navegar a la pantalla de solicitud después de un pequeño delay
      setTimeout(() => {
        router.push(`/(entrenador)/solicitud/${evento.id}`);
      }, 300);
    }
  };

  if (!evento) {
    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={["40%"]}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.container}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No hay evento seleccionado
          </Text>
        </BottomSheetView>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={["50%"]}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.container}>
        {/* Header con ícono de error */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon source="ion:close-circle" size={48} color="#F44336" />
          </View>
          <Text variant="headlineSmall" style={styles.title}>
            Solicitud Rechazada
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {evento.nombre}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* Motivo del rechazo */}
        <View style={styles.motivoContainer}>
          <View style={styles.motivoHeader}>
            <Icon
              source="ion:information-circle"
              size={20}
              color={theme.colors.primary}
            />
            <Text variant="titleMedium" style={styles.motivoTitle}>
              Motivo del rechazo
            </Text>
          </View>

          {evento.motivoRechazo ? (
            <View style={styles.motivoCard}>
              <Text variant="bodyMedium" style={styles.motivoText}>
                {evento.motivoRechazo}
              </Text>
            </View>
          ) : (
            <View style={styles.motivoCard}>
              <Text variant="bodyMedium" style={styles.motivoTextEmpty}>
                No se especificó un motivo de rechazo
              </Text>
            </View>
          )}
        </View>

        {/* Botones de acción */}
        <View style={styles.actions}>
          <ThemeButton
            mode="contained"
            icon="ion:refresh"
            onPress={handleVolverSolicitar}
            style={styles.primaryButton}
          >
            Volver a Solicitar
          </ThemeButton>

          <ThemeButton
            mode="outlined"
            onPress={handleClose}
            style={styles.secondaryButton}
          >
            Cerrar
          </ThemeButton>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

const createStyles = (theme: any) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
    },
    handleIndicator: {
      backgroundColor: theme.colors.onSurfaceDisabled,
      width: 40,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    header: {
      alignItems: "center",
      paddingVertical: 16,
      gap: 8,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#F4433610",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    title: {
      color: theme.colors.onSurface,
      fontWeight: "700",
      textAlign: "center",
    },
    subtitle: {
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
    },
    divider: {
      marginVertical: 16,
    },
    motivoContainer: {
      flex: 1,
      gap: 12,
    },
    motivoHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    motivoTitle: {
      color: theme.colors.onSurface,
      fontWeight: "600",
    },
    motivoCard: {
      backgroundColor: theme.colors.surfaceVariant,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 3,
      borderLeftColor: "#F44336",
    },
    motivoText: {
      color: theme.colors.onSurface,
      lineHeight: 22,
    },
    motivoTextEmpty: {
      color: theme.colors.onSurfaceVariant,
      fontStyle: "italic",
      lineHeight: 22,
    },
    actions: {
      gap: 12,
      marginTop: 16,
    },
    primaryButton: {
      borderRadius: 12,
    },
    secondaryButton: {
      borderRadius: 12,
    },
    emptyText: {
      textAlign: "center",
      color: theme.colors.onSurfaceVariant,
      marginTop: 20,
    },
  });

EventoRechazoBottomSheet.displayName = "EventoRechazoBottomSheet";
