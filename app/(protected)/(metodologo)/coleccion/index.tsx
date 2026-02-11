import {
  aprobarSolicitud,
  rechazarSolicitud,
} from "@/core/avales/actions/colecciones-actions";
import { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import { getEstadoBadge } from "@/core/constants/avales.constants";
import { formatDateLong } from "@/helpers/date.helper";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card,
  Dialog,
  Icon,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function ColeccionDetail() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Parse data from params
  const item: ColeccionAval | null = params.data
    ? JSON.parse(params.data as string)
    : null;

  const openDocument = async (url: string | null | undefined) => {
    if (url) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await WebBrowser.openBrowserAsync(url);
    }
  };

  if (!item) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            title: "Error",
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTintColor: theme.colors.onPrimary,
          }}
        />
        <View style={styles.centered}>
          <Icon source="ion:alert-circle-outline" size={48} color={theme.colors.error} />
          <Text variant="bodyLarge" style={{ marginTop: 12 }}>
            No se encontró la información
          </Text>
          <Button onPress={() => router.back()} style={{ marginTop: 16 }}>
            Volver
          </Button>
        </View>
      </ThemedView>
    );
  }

  const handleAprobar = async () => {
    if (!user?.id) {
      toast.error("No se pudo identificar al usuario");
      return;
    }

    Alert.alert(
      "Confirmar Aprobación",
      "¿Estás seguro de que deseas aprobar esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar",
          onPress: async () => {
            try {
              setIsProcessing(true);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await aprobarSolicitud(item.id, user.id, "REVISION_METODOLOGO");
              toast.success("Solicitud aprobada correctamente");
              queryClient.invalidateQueries({ queryKey: ["colecciones"] });
              router.back();
            } catch (error) {
              console.error(error);
              toast.error("Error al aprobar la solicitud");
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleRechazar = async () => {
    if (!user?.id) {
      toast.error("No se pudo identificar al usuario");
      return;
    }

    if (!rejectReason.trim()) {
      toast.error("Debes ingresar un motivo de rechazo");
      return;
    }

    try {
      setIsProcessing(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await rechazarSolicitud(item.id, user.id, rejectReason);
      toast.success("Solicitud rechazada correctamente");
      queryClient.invalidateQueries({ queryKey: ["colecciones"] });
      setShowRejectDialog(false);
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Error al rechazar la solicitud");
    } finally {
      setIsProcessing(false);
    }
  };

  const estado = getEstadoBadge(item.estado, item.etapaActual || item.etapa, theme.dark);
  const isPending = item.estado !== "ACEPTADO" && item.estado !== "RECHAZADO";

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Revisión de Solicitud",
          headerBackTitle: "Atrás",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.onPrimary,
        }}
      />

      <ScrollView
        contentContainerStyle={[styles.content, isPending && { paddingBottom: 100 }]}
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
              {item.evento.nombre}
            </Text>

            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
              numberOfLines={2}
            >
              {item.descripcion}
            </Text>

            <View style={styles.metaRow}>
              <View style={[styles.metaChip, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Icon source="ion:location-outline" size={14} color={theme.colors.primary} />
                <Text style={[styles.metaChipText, { color: theme.colors.onSurfaceVariant }]}>
                  {item.evento.ciudad}
                </Text>
              </View>
              <View style={[styles.metaChip, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Icon source="ion:calendar-outline" size={14} color={theme.colors.primary} />
                <Text style={[styles.metaChipText, { color: theme.colors.onSurfaceVariant }]}>
                  {formatDateLong(item.evento.fechaInicio).split(",")[0]}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Info Cards Row */}
        <View style={styles.infoCardsRow}>
          <Surface style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Icon source="ion:code-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Código</Text>
            <Text style={[styles.infoValue, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {item.evento.codigo}
            </Text>
          </Surface>

          <Surface style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Icon source="ion:trophy-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Tipo</Text>
            <Text style={[styles.infoValue, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {item.evento.tipoEvento}
            </Text>
          </Surface>

          <Surface style={[styles.infoCard, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <Icon source="ion:globe-outline" size={18} color={theme.colors.primary} />
            <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>Alcance</Text>
            <Text style={[styles.infoValue, { color: theme.colors.onSurface }]} numberOfLines={1}>
              {item.evento.alcance}
            </Text>
          </Surface>
        </View>

        {/* Detalles del Evento */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon source="ion:information-circle-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Detalles del Evento
              </Text>
            </View>

            <View style={styles.detailsList}>
              <DetailRow label="Lugar" value={`${item.evento.lugar}, ${item.evento.ciudad}`} theme={theme} />
              <DetailRow label="Provincia" value={`${item.evento.provincia}, ${item.evento.pais}`} theme={theme} />
              <DetailRow label="Fecha Inicio" value={formatDateLong(item.evento.fechaInicio)} theme={theme} />
              <DetailRow label="Fecha Fin" value={formatDateLong(item.evento.fechaFin)} theme={theme} isLast />
            </View>
          </Card.Content>
        </Card>

        {/* Aval Técnico */}
        {item.avalTecnico && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Icon source="ion:clipboard-outline" size={18} color={theme.colors.primary} />
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Aval Técnico
                </Text>
              </View>

              <View style={styles.detailsList}>
                <DetailRow
                  label="Salida"
                  value={`${formatDateLong(item.avalTecnico.fechaHoraSalida)}`}
                  theme={theme}
                />
                <DetailRow label="Transporte Ida" value={item.avalTecnico.transporteSalida} theme={theme} />
                <DetailRow
                  label="Retorno"
                  value={`${formatDateLong(item.avalTecnico.fechaHoraRetorno)}`}
                  theme={theme}
                />
                <DetailRow label="Transporte Vuelta" value={item.avalTecnico.transporteRetorno} theme={theme} isLast />
              </View>

              {/* Participantes */}
              <View style={styles.participantsRow}>
                <View style={[styles.participantBox, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Text style={[styles.participantNumber, { color: theme.colors.primary }]}>
                    {item.avalTecnico.atletas}
                  </Text>
                  <Text style={[styles.participantLabel, { color: theme.colors.onPrimaryContainer }]}>
                    Atletas
                  </Text>
                </View>

                <View style={[styles.participantBox, { backgroundColor: theme.colors.secondaryContainer }]}>
                  <Text style={[styles.participantNumber, { color: theme.colors.secondary }]}>
                    {item.avalTecnico.entrenadores}
                  </Text>
                  <Text style={[styles.participantLabel, { color: theme.colors.onSecondaryContainer }]}>
                    Entrenadores
                  </Text>
                </View>
              </View>

              {item.avalTecnico.observaciones && (
                <View style={[styles.observacionBox, { backgroundColor: theme.colors.surfaceVariant }]}>
                  <Text style={[styles.observacionLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Observaciones:
                  </Text>
                  <Text style={{ color: theme.colors.onSurface }}>
                    {item.avalTecnico.observaciones}
                  </Text>
                </View>
              )}
            </Card.Content>
          </Card>
        )}

        {/* Documentos */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} mode="elevated">
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon source="ion:document-text-outline" size={18} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Documentos</Text>
            </View>

            <View style={styles.documentsList}>
              {item.convocatoriaUrl && (
                <DocumentRow
                  label="Convocatoria"
                  icon="ion:megaphone-outline"
                  url={item.convocatoriaUrl}
                  theme={theme}
                  onPress={openDocument}
                />
              )}
              {item.dtmUrl && (
                <DocumentRow
                  label="Aval DTM"
                  icon="ion:clipboard-outline"
                  url={item.dtmUrl}
                  theme={theme}
                  onPress={openDocument}
                />
              )}
              {item.pdaUrl && (
                <DocumentRow
                  label="Certificación PDA"
                  icon="ion:ribbon-outline"
                  url={item.pdaUrl}
                  theme={theme}
                  onPress={openDocument}
                />
              )}
              {item.solicitudUrl && (
                <DocumentRow
                  label="Solicitud de Aval"
                  icon="ion:paper-plane-outline"
                  url={item.solicitudUrl}
                  theme={theme}
                  onPress={openDocument}
                />
              )}
              {item.aval && (
                <DocumentRow
                  label="Aval Completo"
                  icon="ion:checkmark-done-circle-outline"
                  url={item.aval}
                  theme={theme}
                  onPress={openDocument}
                  isLast
                />
              )}
              {!item.convocatoriaUrl && !item.dtmUrl && !item.pdaUrl && !item.solicitudUrl && !item.aval && (
                <Text style={[styles.noDocuments, { color: theme.colors.onSurfaceVariant }]}>
                  No hay documentos disponibles aún
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Estado del comentario si fue rechazado */}
        {item.estado === "RECHAZADO" && item.comentario && (
          <Surface style={[styles.alertBox, { backgroundColor: estado.bg }]} elevation={0}>
            <Icon source="ion:close-circle" size={20} color={estado.color} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: estado.color }]}>Motivo del Rechazo</Text>
              <Text style={[styles.alertText, { color: estado.color }]}>{item.comentario}</Text>
            </View>
          </Surface>
        )}
      </ScrollView>

      {/* Footer Actions - Only show if pending */}
      {isPending && (
        <Surface style={[styles.footer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outlineVariant }]} elevation={4}>
          <Button
            mode="outlined"
            onPress={() => setShowRejectDialog(true)}
            style={[styles.footerButton, { borderColor: theme.colors.error }]}
            textColor={theme.colors.error}
            disabled={isProcessing}
            icon="ion:close-circle-outline"
          >
            Rechazar
          </Button>
          <Button
            mode="contained"
            onPress={handleAprobar}
            style={styles.footerButton}
            disabled={isProcessing}
            loading={isProcessing}
            icon="ion:checkmark-circle-outline"
          >
            Aprobar
          </Button>
        </Surface>
      )}

      {/* Reject Dialog */}
      <Portal>
        <Dialog visible={showRejectDialog} onDismiss={() => setShowRejectDialog(false)}>
          <Dialog.Title>Rechazar Solicitud</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 12, color: theme.colors.onSurfaceVariant }}>
              Por favor, indica el motivo del rechazo:
            </Text>
            <TextInput
              label="Motivo"
              value={rejectReason}
              onChangeText={setRejectReason}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowRejectDialog(false)}>Cancelar</Button>
            <Button
              onPress={handleRechazar}
              textColor={theme.colors.error}
              loading={isProcessing}
              disabled={isProcessing}
            >
              Rechazar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ThemedView>
  );
}

// Componentes auxiliares
const DetailRow = ({
  label,
  value,
  theme,
  isLast = false,
}: {
  label: string;
  value: string;
  theme: any;
  isLast?: boolean;
}) => (
  <View
    style={[
      detailRowStyles.container,
      !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceVariant },
    ]}
  >
    <Text style={[detailRowStyles.label, { color: theme.colors.onSurfaceVariant }]}>{label}</Text>
    <Text style={[detailRowStyles.value, { color: theme.colors.onSurface }]} numberOfLines={2}>
      {value}
    </Text>
  </View>
);

const DocumentRow = ({
  label,
  icon,
  url,
  theme,
  onPress,
  isLast = false,
}: {
  label: string;
  icon: string;
  url: string;
  theme: any;
  onPress: (url: string) => void;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    style={[
      documentRowStyles.container,
      !isLast && { borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceVariant },
    ]}
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

const documentRowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderRadius: 12,
  },
  headerContent: {
    gap: 8,
  },
  estadoBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  estadoText: {
    fontWeight: "600",
    fontSize: 12,
  },
  title: {
    fontWeight: "600",
    fontSize: 17,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 8,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metaChipText: {
    fontSize: 12,
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
    marginTop: 16,
  },
  participantBox: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    gap: 4,
  },
  participantNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  participantLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  observacionBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  observacionLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  alertBox: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    gap: 12,
    alignItems: "flex-start",
  },
  alertTitle: {
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 2,
  },
  alertText: {
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 12,
  },
  footerButton: {
    flex: 1,
    borderRadius: 8,
  },
});
