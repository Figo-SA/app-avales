import { getColeccionByEvento } from "@/core/avales/actions/colecciones-actions";
import { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import { getEventoById } from "@/core/eventos/actions/eventos-actions";
import { Evento } from "@/core/eventos/interfaces/evento";
import { uploadConvocatoria } from "@/core/solicitud/actions/solicitud-actions";
import { formatDateLong } from "@/helpers/date.helper";
import { EmptyState } from "@/presentation/theme/components/EmptyState";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Button,
    Card,
    Chip,
    Icon,
    Surface,
    Text,
    useTheme
} from "react-native-paper";

export default function EventoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const {
    data: evento,
    isLoading,
    error,
  } = useQuery<Evento, Error>({
    queryKey: ["evento", id],
    queryFn: async () => {
      const result = await getEventoById(Number(id));
      if (!result) throw new Error("Evento no encontrado");
      return result;
    },
    enabled: !!id,
  });

  // Obtener la colección/aval del evento si existe
  const { data: coleccion } = useQuery<ColeccionAval | null>({
    queryKey: ["coleccion-evento", id],
    queryFn: () => getColeccionByEvento(Number(id)),
    enabled: !!id && evento?.estado !== "DISPONIBLE",
  });

  const openDocument = async (url: string | null | undefined) => {
    if (url) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await WebBrowser.openBrowserAsync(url);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: "Cargando..." }} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ThemedView>
    );
  }

  if (error || !evento) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: "Error" }} />
        <EmptyState
          icon="ion:alert-circle-outline"
          title="Error al cargar"
          description="No se pudo cargar el evento."
        />
      </ThemedView>
    );
  }

  const estadoEvento = evento.estado?.toLowerCase() || "disponible";

  const getEstadoInfo = () => {
    const isDark = theme.dark;
    switch (estadoEvento) {
      case "solicitado":
        return {
          label: "En Revisión",
          color: isDark ? "#FBBF24" : "#D97706",
          bg: isDark ? "#78350F" : "#FEF3C7",
          icon: "ion:time-outline"
        };
      case "aceptado":
        return {
          label: "Aprobado",
          color: isDark ? "#34D399" : "#059669",
          bg: isDark ? "#064E3B" : "#D1FAE5",
          icon: "ion:checkmark-circle"
        };
      case "rechazado":
        return {
          label: "Rechazado",
          color: isDark ? "#F87171" : "#DC2626",
          bg: isDark ? "#7F1D1D" : "#FEE2E2",
          icon: "ion:close-circle"
        };
      default:
        return {
          label: "Disponible",
          color: theme.colors.primary,
          bg: theme.colors.primaryContainer,
          icon: "ion:checkmark-circle-outline"
        };
    }
  };

  const estado = getEstadoInfo();

  const [documento, setDocumento] = useState<{
    uri: string;
    name: string;
    type: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Ref para el Bottom Sheet
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "80%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleSolicitar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Si ya existe una colección, navegar directamente al formulario (Paso 2)
    if (coleccion) {
        router.push({
            pathname: "/solicitud/[eventoId]",
            params: { eventoId: evento.id, initialStep: 2, coleccionId: coleccion.id }
        });
    } else {
        // Si no, abrir el bottom sheet para subir la convocatoria
        bottomSheetRef.current?.present();
    }
  };

  const seleccionarDocumento = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setDocumento({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/pdf",
        });
      }
    } catch (error) {
      console.error("Error al seleccionar documento:", error);
      toast.error("No se pudo seleccionar el documento");
    }
  };

  const handleUpload = async (continueToForm: boolean) => {
      if (!documento) {
          toast.error("Debes seleccionar un documento");
          return;
      }

      try {
          setIsUploading(true);
          const result = await uploadConvocatoria(Number(evento.id), documento);
          toast.success("Convocatoria subida exitosamente");
          
          bottomSheetRef.current?.dismiss();
          
          if (continueToForm) {
              router.push({
                  pathname: "/solicitud/[eventoId]",
                  params: { eventoId: evento.id, initialStep: 2, coleccionId: result.coleccionAvalId }
              });
          }

      } catch (error) {
          console.error("Error uploading:", error);
          toast.error("Error al subir el documento");
      } finally {
          setIsUploading(false);
      }
  };

  const renderDocumentoSheet = () => (
      <BottomSheetView style={styles.sheetContent}>
          <Text variant="titleLarge" style={[styles.sheetTitle, { color: theme.colors.onSurface }]}>
              Iniciar Solicitud
          </Text>
          <Text variant="bodyMedium" style={[styles.sheetDesc, { color: theme.colors.onSurfaceVariant }]}>
              Para solicitar el aval, primero debes subir la convocatoria oficial del evento.
          </Text>

          <Button
            mode="outlined"
            icon="ion:cloud-upload-outline"
            onPress={seleccionarDocumento}
            style={styles.uploadButton}
            contentStyle={{ height: 48 }}
          >
            {documento ? "Cambiar Documento" : "Seleccionar Convocatoria"}
          </Button>

          {documento && (
            <Surface style={[styles.filePreview, { backgroundColor: theme.colors.elevation.level1 }]} elevation={0}>
              <Icon source="ion:document" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ fontWeight: '500', color: theme.colors.onSurface }}>{documento.name}</Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>{(documento.uri.length/1024).toFixed(2)} KB</Text>
              </View>
              <Icon source="ion:checkmark-circle" size={20} color={theme.colors.primary} />
            </Surface>
          )}

          <View style={styles.sheetActions}>
            <Button 
                mode="contained" 
                onPress={() => handleUpload(true)}
                disabled={!documento || isUploading}
                loading={isUploading}
                style={styles.actionButton}
            >
                Subir y Llenar Formulario
            </Button>
            <Button 
                mode="text" 
                onPress={() => handleUpload(false)}
                disabled={!documento || isUploading}
                style={styles.actionButton}
            >
                Subir y Llenar Después
            </Button>
          </View>
      </BottomSheetView>
  );

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Detalle del Evento",
          headerBackTitle: "Atrás",
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.onPrimary,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
          <Card.Content style={styles.headerContent}>
            <View style={[styles.estadoBadge, { backgroundColor: estado.bg }]}>
              <Icon source={estado.icon} size={14} color={estado.color} />
              <Text style={[styles.estadoText, { color: estado.color }]}>
                {estado.label}
              </Text>
            </View>

            <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
              {evento.nombre}
            </Text>

            <View style={styles.metaRow}>
              <Chip compact style={[{ backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={{ fontSize: 10, color: theme.colors.primary }}>{evento.tipoEvento}</Text>
              </Chip>
              <Chip compact style={[{ backgroundColor: theme.colors.secondaryContainer }]}>
                <Text style={{ fontSize: 10, color: theme.colors.onSecondaryContainer }}>{evento.codigo}</Text>
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Info Cards Row */}
        <View style={styles.infoCardsRow}>
          <Surface style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Icon source="ion:calendar-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Inicio</Text>
            <Text style={[styles.infoValue, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {formatDateLong(evento.fechaInicio).split(",")[0]}
            </Text>
          </Surface>

          <Surface style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Icon source="ion:location-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Ciudad</Text>
            <Text style={[styles.infoValue, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {evento.ciudad}
            </Text>
          </Surface>

          <Surface style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Icon source="ion:globe-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Alcance</Text>
            <Text style={[styles.infoValue, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {evento.alcance}
            </Text>
          </Surface>
        </View>

        {/* Detalles Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon source="ion:information-circle-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Detalles</Text>
            </View>

            <View style={styles.detailsList}>
              <DetailRow label="Fecha Inicio" value={formatDateLong(evento.fechaInicio)} theme={theme} />
              <DetailRow label="Fecha Fin" value={formatDateLong(evento.fechaFin)} theme={theme} />
              <DetailRow label="Lugar" value={`${evento.lugar}, ${evento.ciudad}`} theme={theme} />
              <DetailRow label="Provincia" value={`${evento.provincia}, ${evento.pais}`} theme={theme} />
              <DetailRow label="Disciplina" value={evento.disciplina?.nombre} theme={theme} />
              <DetailRow label="Categoría" value={evento.categoria?.nombre} theme={theme} />
              <DetailRow label="Género" value={evento.genero} theme={theme} isLast />
            </View>
          </Card.Content>
        </Card>

        {/* Participantes Card */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon source="ion:people-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Participantes</Text>
            </View>

            <View style={styles.participantsRow}>
              <View style={[styles.participantBox, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={[styles.participantNumber, { color: theme.colors.primary }]}>
                  {evento.numAtletasHombres + evento.numAtletasMujeres}
                </Text>
                <Text style={[styles.participantLabel, { color: theme.colors.onPrimaryContainer }]}>
                  Atletas
                </Text>
                <Text style={[styles.participantSub, { color: theme.colors.onPrimaryContainer }]}>
                  {evento.numAtletasHombres}H / {evento.numAtletasMujeres}M
                </Text>
              </View>

              <View style={[styles.participantBox, { backgroundColor: theme.colors.secondaryContainer }]}>
                <Text style={[styles.participantNumber, { color: theme.colors.secondary }]}>
                  {evento.numEntrenadoresHombres + evento.numEntrenadoresMujeres}
                </Text>
                <Text style={[styles.participantLabel, { color: theme.colors.onSecondaryContainer }]}>
                  Entrenadores
                </Text>
                <Text style={[styles.participantSub, { color: theme.colors.onSecondaryContainer }]}>
                  {evento.numEntrenadoresHombres}H / {evento.numEntrenadoresMujeres}M
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Documentos Card - Solo si hay colección */}
        {coleccion && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Icon source="ion:document-text-outline" size={18} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Documentos</Text>
              </View>

              <View style={styles.documentsList}>
                {coleccion.convocatoriaUrl && (
                  <DocumentRow
                    label="Convocatoria"
                    icon="ion:megaphone-outline"
                    url={coleccion.convocatoriaUrl}
                    theme={theme}
                    onPress={openDocument}
                  />
                )}
                {coleccion.dtmUrl && (
                  <DocumentRow
                    label="Aval DTM"
                    icon="ion:clipboard-outline"
                    url={coleccion.dtmUrl}
                    theme={theme}
                    onPress={openDocument}
                  />
                )}
                {coleccion.pdaUrl && (
                  <DocumentRow
                    label="Certificación PDA"
                    icon="ion:document-attach-outline"
                    url={coleccion.pdaUrl}
                    theme={theme}
                    onPress={openDocument}
                  />
                )}
                {coleccion.solicitudUrl && (
                  <DocumentRow
                    label="Solicitud de Aval"
                    icon="ion:paper-plane-outline"
                    url={coleccion.solicitudUrl}
                    theme={theme}
                    onPress={openDocument}
                  />
                )}
                {coleccion.aval && (
                  <DocumentRow
                    label="Aval Completo"
                    icon="ion:checkmark-done-circle-outline"
                    url={coleccion.aval}
                    theme={theme}
                    onPress={openDocument}
                  />
                )}
                {!coleccion.convocatoriaUrl && !coleccion.dtmUrl && !coleccion.pdaUrl && !coleccion.solicitudUrl && !coleccion.aval && (
                  <Text style={[styles.noDocuments, { color: theme.colors.onSurfaceVariant }]}>
                    No hay documentos disponibles aún
                  </Text>
                )}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Alertas de estado */}
        {estadoEvento === "solicitado" && (
          <Surface style={[styles.alertBox, { backgroundColor: estado.bg }]} elevation={0}>
            <Icon source="ion:time-outline" size={18} color={estado.color} />
            <Text style={[styles.alertText, { color: estado.color }]}>
              Tu solicitud está en revisión.
            </Text>
          </Surface>
        )}

        {estadoEvento === "aceptado" && (
          <Surface style={[styles.alertBox, { backgroundColor: estado.bg }]} elevation={0}>
            <Icon source="ion:checkmark-circle" size={18} color={estado.color} />
            <Text style={[styles.alertText, { color: estado.color }]}>
              ¡Solicitud aprobada!
            </Text>
          </Surface>
        )}

        {estadoEvento === "rechazado" && (
          <Surface style={[styles.alertBox, { backgroundColor: estado.bg }]} elevation={0}>
            <Icon source="ion:close-circle" size={18} color={estado.color} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertText, { color: estado.color }]}>
                Solicitud rechazada.
              </Text>
              {evento.motivoRechazo && (
                <Text style={[styles.alertText, { color: estado.color, marginTop: 2 }]}>
                  {evento.motivoRechazo}
                </Text>
              )}
            </View>
          </Surface>
        )}

        {/* Botón */}
        {estadoEvento === "disponible" && (
          <Button
            mode="contained"
            onPress={handleSolicitar}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Solicitar Participación
          </Button>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.colors.elevation.level2 }}
      >
        {renderDocumentoSheet()}
      </BottomSheetModal>
    </ThemedView>
  );
}

const DetailRow = ({
  label,
  value,
  theme,
  isLast = false
}: {
  label: string;
  value: string;
  theme: any;
  isLast?: boolean;
}) => (
  <View style={[
    detailRowStyles.container,
    !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceVariant }
  ]}>
    <Text style={[detailRowStyles.label, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
    <Text style={[detailRowStyles.value, { color: theme.colors.onSurface }]} numberOfLines={2}>{value}</Text>
  </View>
);

const DocumentRow = ({
  label,
  icon,
  url,
  theme,
  onPress,
}: {
  label: string;
  icon: string;
  url: string;
  theme: any;
  onPress: (url: string) => void;
}) => (
  <TouchableOpacity
    style={[documentRowStyles.container, { borderBottomColor: theme.colors.surfaceVariant }]}
    onPress={() => onPress(url)}
    activeOpacity={0.7}
  >
    <View style={[documentRowStyles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
      <Icon source={icon} size={18} color={theme.colors.primary} />
    </View>
    <Text style={[documentRowStyles.label, { color: theme.colors.onSurface }]}>{label}</Text>
    <Icon source="ion:open-outline" size={16} color={theme.colors.primary} />
  </TouchableOpacity>
);

const documentRowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
});

const detailRowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  label: {
    fontSize: 13,
  },
  value: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderRadius: 12,
  },
  headerContent: {
    gap: 10,
  },
  estadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontWeight: "600",
    fontSize: 11,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },

  infoCardsRow: {
    flexDirection: "row",
    gap: 8,
  },
  infoCard: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    gap: 4,
  },
  infoLabel: {
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 14,
  },
  detailsList: {
    gap: 0,
  },
  documentsList: {
    gap: 0,
  },
  noDocuments: {
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 16,
  },
  participantsRow: {
    flexDirection: "row",
    gap: 10,
  },
  participantBox: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    gap: 4,
  },
  participantNumber: {
    fontSize: 22,
    fontWeight: "700",
  },
  participantLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  participantSub: {
    fontSize: 10,
  },
  alertBox: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    gap: 10,
    alignItems: "center",
  },
  alertText: {
    fontSize: 12,
    flex: 1,
  },
  button: {
    borderRadius: 10,
    marginTop: 4,
  },
  buttonLabel: {
    fontSize: 14,
  },
  sheetContent: {
    padding: 24,
    gap: 16,
    flex: 1,
  },
  sheetTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sheetDesc: {
    textAlign: 'center',
    marginBottom: 8,
  },
  uploadButton: {
    borderColor: '#E0E0E0', 
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
    marginTop: 8,
  },
  sheetActions: {
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    borderRadius: 8,
  }
});
