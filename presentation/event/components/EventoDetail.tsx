import { Evento } from "@/core/eventos/interfaces/evento";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import { toast } from "@backpackapp-io/react-native-toast";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import * as DocumentPicker from "expo-document-picker";
import React, { forwardRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Divider, Icon, Surface, Text, useTheme } from "react-native-paper";

interface EventoDetailProps {
  evento: Evento | null;
  onDocumentUploaded?: (file: DocumentPicker.DocumentPickerAsset) => void;
}

export const EventoDetail = forwardRef<BottomSheet, EventoDetailProps>(
  ({ evento, onDocumentUploaded }, ref) => {
    const theme = useTheme();
    const [uploadedFile, setUploadedFile] =
      useState<DocumentPicker.DocumentPickerAsset | null>(null);
    const styles = createStyles(theme);

    const handlePickDocument = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: "application/pdf",
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          const file = result.assets[0];
          setUploadedFile(file);
          onDocumentUploaded?.(file);
          toast.success(
            "Documento cargado " +
              `${file.name} (${(file.size! / 1024).toFixed(2)} KB)`
          );
        }
      } catch (error) {
        toast.error("Error" + "No se pudo cargar el documento");
        console.error("Error picking document:", error);
      }
    };

    const handleSheetChanges = (index: number) => {
      if (index === -1) {
        // Reset when closed
        setUploadedFile(null);
      }
    };

    if (!evento) {
      return (
        <BottomSheet
          ref={ref}
          index={-1}
          snapPoints={["20%"]}
          onChange={handleSheetChanges}
          backgroundStyle={styles.bottomSheetBackground}
          handleIndicatorStyle={styles.handleIndicator}
        >
          <BottomSheetScrollView style={styles.container}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No hay evento seleccionado
            </Text>
          </BottomSheetScrollView>
        </BottomSheet>
      );
    }

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={["50%", "85%"]}
        enablePanDownToClose
        onChange={handleSheetChanges}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
              {evento.evento}
            </Text>
            <Surface style={styles.badge} elevation={1}>
              <Text variant="labelSmall" style={styles.badgeText}>
                {evento.alcance}
              </Text>
            </Surface>
          </View>

          <Divider style={styles.divider} />

          {/* Solicitud de Aval - Subir Documento */}
          <View style={styles.section}>
            <View style={styles.uploadHeader}>
              <Icon
                source="ion:document-attach"
                size={24}
                color={theme.colors.primary}
              />
              <Text variant="titleMedium" style={styles.uploadTitle}>
                Solicitar Aval
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.sectionDescription}>
              Sube tu documento de solicitud en formato PDF para poder crear el
              aval
            </Text>

            {uploadedFile && (
              <Surface style={styles.fileCard} elevation={1}>
                <Icon
                  source="ion:document-text"
                  size={24}
                  color={theme.colors.primary}
                />
                <View style={styles.fileInfo}>
                  <Text variant="bodyMedium" style={styles.fileName}>
                    {uploadedFile.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.fileSize}>
                    {(uploadedFile.size! / 1024).toFixed(2)} KB
                  </Text>
                </View>
                <Icon
                  source="ion:checkmark-circle"
                  size={24}
                  color={theme.colors.primary}
                />
              </Surface>
            )}

            <ThemeButton
              mode="contained"
              icon="ion:cloud-upload"
              onPress={handlePickDocument}
              style={styles.uploadButton}
            >
              {uploadedFile
                ? "Cambiar Documento"
                : "Subir Documento de Solicitud"}
            </ThemeButton>
          </View>

          <Divider style={styles.divider} />

          {/* Información General */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Información General
            </Text>

            <InfoRow
              icon="ion:calendar"
              label="Fecha Inicio"
              value={evento.fechaInicio}
            />
            <InfoRow
              icon="ion:calendar-outline"
              label="Fecha Fin"
              value={evento.fechaFin}
            />
            <InfoRow
              icon="ion:location"
              label="Provincia"
              value={evento.provincia}
            />
            <InfoRow
              icon="ion:basketball"
              label="Deporte"
              value={evento.deporte}
            />
          </View>

          <Divider style={styles.divider} />

          {/* Participación */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Tipo de Participación
            </Text>
            <Surface style={styles.participationCard} elevation={2}>
              <Icon
                source="ion:people"
                size={24}
                color={theme.colors.primary}
              />
              <Text variant="bodyLarge" style={styles.participationText}>
                {evento.tipoParticipacion}
              </Text>
            </Surface>
          </View>

          <Divider style={styles.divider} />

          {/* Estadísticas */}
          <View style={styles.section}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Estadísticas
            </Text>
            <View style={styles.statsContainer}>
              <Surface style={styles.statCard} elevation={1}>
                <Icon
                  source="ion:person"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text variant="bodySmall" style={styles.statLabel}>
                  Deportistas
                </Text>
                <Text variant="titleLarge" style={styles.statValue}>
                  {evento.numeroAtletasHombres + evento.numeroAtletasMujeres}
                </Text>
              </Surface>
              <Surface style={styles.statCard} elevation={1}>
                <Icon
                  source="ion:school"
                  size={20}
                  color={theme.colors.secondary}
                />
                <Text variant="bodySmall" style={styles.statLabel}>
                  Entrenadores
                </Text>
                <Text variant="titleLarge" style={styles.statValue}>
                  {evento.numeroEntrenadoresHombres +
                    evento.numeroEntrenadoresMujeres}
                </Text>
              </Surface>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Espacio al final para scroll */}
          <View style={styles.bottomPadding} />
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

// Componente auxiliar para filas de información
interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconContainer}>
        <Icon source={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text variant="bodySmall" style={styles.infoLabel}>
          {label}
        </Text>
        <Text variant="bodyLarge" style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    bottomSheetBackground: {
      backgroundColor: theme.colors.background,
    },
    handleIndicator: {
      backgroundColor: theme.colors.outline,
    },
    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontWeight: "700",
      color: theme.colors.onSurface,
      marginBottom: 8,
    },
    badge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.colors.primaryContainer,
    },
    badgeText: {
      color: theme.colors.onPrimaryContainer,
      fontWeight: "600",
      textTransform: "uppercase",
    },
    divider: {
      marginVertical: 16,
    },
    section: {
      marginBottom: 8,
    },
    uploadHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 8,
    },
    uploadTitle: {
      fontWeight: "600",
      color: theme.colors.onSurface,
    },
    sectionTitle: {
      fontWeight: "600",
      color: theme.colors.onSurface,
      marginBottom: 12,
    },
    sectionDescription: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    infoIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primaryContainer,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    infoContent: {
      flex: 1,
    },
    infoLabel: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: 2,
    },
    infoValue: {
      color: theme.colors.onSurface,
      fontWeight: "500",
    },
    participationCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.primaryContainer,
      gap: 12,
    },
    participationText: {
      color: theme.colors.onSecondaryContainer,
      fontWeight: "600",
    },
    statsContainer: {
      flexDirection: "row",
      gap: 12,
    },
    statCard: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: "center",
      gap: 8,
    },
    statLabel: {
      color: theme.colors.onSurfaceVariant,
      textAlign: "center",
    },
    statValue: {
      color: theme.colors.onSurface,
      fontWeight: "700",
    },
    fileCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.primaryContainer,
      marginBottom: 12,
      gap: 12,
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      color: theme.colors.onPrimaryContainer,
      fontWeight: "500",
    },
    fileSize: {
      color: theme.colors.onPrimaryContainer,
      opacity: 0.7,
    },
    uploadButton: {
      marginTop: 8,
    },
    emptyText: {
      textAlign: "center",
      color: theme.colors.onSurfaceVariant,
      marginTop: 20,
    },
    bottomPadding: {
      height: 40,
    },
  });

EventoDetail.displayName = "EventoDetail";
