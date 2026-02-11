import {
  aprobarSolicitud,
  createComprasPublicas,
  getColeccionById,
  rechazarSolicitud,
} from "@/core/avales/actions/colecciones-actions";
import { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ComprasPublicasPreviewHtml } from "@/presentation/aval/components/ComprasPublicasPreviewHtml";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Alert, Modal, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Dialog,
  Divider,
  Icon,
  Portal,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function ComprasPublicasColeccionDetail() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showComprasPreview, setShowComprasPreview] = useState(false);
  const [formData, setFormData] = useState({
    numeroCertificado: "",
    realizoProceso: null as boolean | null,
    codigoNecesidad: "",
    objetoContratacion: "",
    nombreFirmante: "",
    cargoFirmante: "Encargada de Compras Públicas",
    fechaEmision: new Date().toISOString().slice(0, 10),
  });

  // Parse initial data from params (partial, from list endpoint)
  const paramItem: ColeccionAval | null = params.data
    ? JSON.parse(params.data as string)
    : null;

  // Fetch full detail data (with nested deportistas, entrenadores, etc.)
  const { data: fullItem } = useQuery({
    queryKey: ["coleccion-detail", paramItem?.id],
    queryFn: () => getColeccionById(paramItem!.id),
    enabled: !!paramItem?.id,
  });

  // Use full data if available, otherwise fall back to params data
  const item = fullItem ?? paramItem;

  // Aval is pending Compras Publicas review only when etapa is PDA
  const isPendingByEtapa = item?.etapaActual === "PDA" || item?.etapa === "PDA";
  const mode = params.mode as string | undefined;
  const isEditMode = mode === "edit" && isPendingByEtapa;

  // Initialize form data when item loads
  if (item && !formData.nombreFirmante && user) {
    setFormData((prev) => ({
      ...prev,
      nombreFirmante: `${user.nombre} ${user.apellido}`.trim(),
    }));
  }

  const openDocument = async (url: string | null | undefined) => {
    if (url) {
      await WebBrowser.openBrowserAsync(url);
    } else {
      toast.error("El documento no está disponible");
    }
  };

  if (!item) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>No se encontró la información de la solicitud.</Text>
        <Button onPress={() => router.back()} style={{ marginTop: 16 }}>
          Volver
        </Button>
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
      "¿Estás seguro de que deseas aprobar la contratación de esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar",
          onPress: async () => {
            try {
              setIsProcessing(true);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await createComprasPublicas(item.id, {
                numeroCertificado: formData.numeroCertificado?.trim() || undefined,
                realizoProceso:
                  typeof formData.realizoProceso === "boolean"
                    ? formData.realizoProceso
                    : undefined,
                codigoNecesidad: formData.codigoNecesidad?.trim() || undefined,
                objetoContratacion: formData.objetoContratacion?.trim() || undefined,
                nombreFirmante: formData.nombreFirmante?.trim() || undefined,
                cargoFirmante: formData.cargoFirmante?.trim() || undefined,
                fechaEmision: formData.fechaEmision?.trim() || undefined,
              });
              await aprobarSolicitud(item.id, user.id, "COMPRAS_PUBLICAS");
              toast.success("Contratación validada correctamente");
              queryClient.invalidateQueries({ queryKey: ["colecciones"] });
              router.back();
            } catch (error) {
              console.error(error);
              toast.error("Error al aprobar la contratación");
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
      await rechazarSolicitud(item.id, user.id, rejectReason, "COMPRAS_PUBLICAS");
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

  const SectionTitle = ({ title, icon }: { title: string; icon: string }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        marginTop: 24,
        paddingHorizontal: 16,
      }}
    >
      <Icon source={icon} size={24} color={theme.colors.primary} />
      <Text
        variant="titleMedium"
        style={{
          fontWeight: "bold",
          marginLeft: 8,
          color: theme.colors.primary,
        }}
      >
        {title}
      </Text>
    </View>
  );

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <Text
        variant="bodyMedium"
        style={{ color: theme.colors.onSurfaceVariant }}
      >
        {label}
      </Text>
      <Text variant="bodyMedium" style={{ fontWeight: "500", maxWidth: "60%" }}>
        {value}
      </Text>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Detalle de Solicitud",
          headerBackTitle: "Atrás",
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.onPrimary,
        }}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: isEditMode ? 100 : 32 }}>
        {!isEditMode && (
          <>
            {/* Header Card */}
            <Surface
              style={{
                margin: 16,
                padding: 16,
                borderRadius: 12,
                backgroundColor: theme.colors.surface,
              }}
              elevation={1}
            >
              <Text
                variant="headlineSmall"
                style={{ fontWeight: "bold", marginBottom: 8 }}
              >
                {item.evento.nombre}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant, marginBottom: 16 }}
              >
                {item.descripcion}
              </Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                <Chip icon="ion:location-outline" compact>
                  {item.evento.ciudad}
                </Chip>
                <Chip icon="ion:calendar-outline" compact>
                  {new Date(item.evento.fechaInicio).toLocaleDateString()}
                </Chip>
              </View>
            </Surface>

            <SectionTitle
              title="Información del Evento"
              icon="ion:information-circle-outline"
            />
            <Card style={{ marginHorizontal: 16 }} mode="outlined">
              <Card.Content>
                <InfoRow label="Código" value={item.evento.codigo} />
                <Divider style={{ marginVertical: 8 }} />
                <InfoRow label="Ciudad" value={item.evento.ciudad} />
                <Divider style={{ marginVertical: 8 }} />
                <InfoRow label="Provincia" value={item.evento.provincia} />
                <Divider style={{ marginVertical: 8 }} />
                <InfoRow
                  label="Fecha"
                  value={new Date(item.evento.fechaInicio).toLocaleDateString()}
                />
              </Card.Content>
            </Card>

            <SectionTitle title="Aval Técnico" icon="ion:list-outline" />
            <Card style={{ marginHorizontal: 16 }} mode="outlined">
              <Card.Content>
                <InfoRow
                  label="Salida"
                  value={item.avalTecnico ? `${new Date(
                    item.avalTecnico.fechaHoraSalida
                  ).toLocaleString()} (${item.avalTecnico.transporteSalida})` : "N/A"}
                />
                <Divider style={{ marginVertical: 8 }} />
                <InfoRow
                  label="Retorno"
                  value={item.avalTecnico ? `${new Date(
                    item.avalTecnico.fechaHoraRetorno
                  ).toLocaleString()} (${item.avalTecnico.transporteRetorno})` : "N/A"}
                />
                <Divider style={{ marginVertical: 8 }} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 8,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      variant="headlineMedium"
                      style={{ color: theme.colors.primary, fontWeight: "bold" }}
                    >
                      {item.avalTecnico?.atletas || 0}
                    </Text>
                    <Text variant="bodySmall">Atletas</Text>
                  </View>
                  <View
                    style={{
                      width: 1,
                      backgroundColor: theme.colors.outlineVariant,
                    }}
                  />
                  <View style={{ alignItems: "center" }}>
                    <Text
                      variant="headlineMedium"
                      style={{ color: theme.colors.primary, fontWeight: "bold" }}
                    >
                      {item.avalTecnico?.entrenadores || 0}
                    </Text>
                    <Text variant="bodySmall">Entrenadores</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>

            {/* Desglose Presupuestario Real */}
            <SectionTitle title="Presupuesto Certificado" icon="ion:receipt-outline" />
            <Card style={{ marginHorizontal: 16 }} mode="outlined">
              <Card.Content style={{ padding: 0 }}>
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: theme.colors.surfaceVariant,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                >
                  <Text variant="labelMedium" style={{ flex: 2, fontWeight: "bold" }}>Item</Text>
                  <Text variant="labelMedium" style={{ flex: 1, fontWeight: "bold", textAlign: "center" }}>Mes</Text>
                  <Text variant="labelMedium" style={{ flex: 1, fontWeight: "bold", textAlign: "right" }}>Monto</Text>
                </View>

                {item.evento.presupuesto && item.evento.presupuesto.length > 0 ? (
                  item.evento.presupuesto.map((p, index) => (
                    <View key={p.id}>
                      <View
                        style={{
                          flexDirection: "row",
                          paddingVertical: 12,
                          paddingHorizontal: 16,
                          alignItems: "center",
                        }}
                      >
                        <View style={{ flex: 2 }}>
                          <Text variant="bodySmall" style={{ fontWeight: "bold" }}>
                            {p.item.nombre}
                          </Text>
                          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                            {p.item.numero}
                          </Text>
                        </View>
                        <Text variant="bodySmall" style={{ flex: 1, textAlign: "center" }}>
                          {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][p.mes - 1]}
                        </Text>
                        <Text variant="bodySmall" style={{ flex: 1, textAlign: "right", fontWeight: "600" }}>
                          ${Number(p.presupuesto).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                      {index < (item.evento.presupuesto?.length || 0) - 1 && <Divider />}
                    </View>
                  ))
                ) : (
                    <View style={{ padding: 16, alignItems: "center" }}>
                      <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
                        No hay asignación presupuestaria registrada
                      </Text>
                    </View>
                )}

                <Divider />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 16,
                    backgroundColor: "rgba(0,0,0,0.02)",
                  }}
                >
                  <Text variant="titleMedium" style={{ fontWeight: "bold" }}>Total Certificado</Text>
                  <Text variant="titleMedium" style={{ fontWeight: "bold", color: theme.colors.primary }}>
                    ${(item.evento.presupuesto?.reduce((sum, p) => sum + Number(p.presupuesto), 0) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </Card.Content>
            </Card>

            {/* Documentos de Respaldo */}
            <SectionTitle title="Documentos de Respaldo" icon="ion:folder-open-outline" />
            <Card style={{ marginHorizontal: 16 }} mode="outlined">
              <Card.Content style={{ gap: 12 }}>
                <Button
                  mode="outlined"
                  icon="ion:document-text-outline"
                  onPress={() => openDocument(item.dtmUrl)}
                  disabled={!item.dtmUrl}
                >
                  Aval Técnico (DTM)
                </Button>
                <Button
                  mode="outlined"
                  icon="ion:ribbon-outline"
                  onPress={() => openDocument(item.pdaUrl)}
                  disabled={!item.pdaUrl}
                >
                  Certificación PDA
                </Button>
                <Button
                  mode="outlined"
                  icon="ion:megaphone-outline"
                  onPress={() => openDocument(item.convocatoriaUrl)}
                  disabled={!item.convocatoriaUrl}
                >
                  Convocatoria
                </Button>
              </Card.Content>
            </Card>
          </>
        )}

        {/* Compras Publicas Form — only when pending */}
        {isEditMode && (
          <>
            <SectionTitle
              title="Certificado Compras Públicas"
              icon="ion:document-text-outline"
            />
            <Card style={{ marginHorizontal: 16 }} mode="outlined">
              <Card.Content>
                <TextInput
                  label="No. Certificado"
                  value={formData.numeroCertificado}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, numeroCertificado: text }))
                  }
                  mode="outlined"
                  style={{ marginBottom: 12 }}
                />

                <Text
                  variant="labelLarge"
                  style={{ marginBottom: 8, color: theme.colors.onSurface }}
                >
                  ¿Se realizó proceso de contratación pública?
                </Text>
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
                  <Button
                    mode={formData.realizoProceso === true ? "contained" : "outlined"}
                    onPress={() => setFormData((prev) => ({ ...prev, realizoProceso: true }))}
                    icon={formData.realizoProceso === true ? "ion:checkmark-circle" : undefined}
                    style={{ flex: 1 }}
                    compact
                  >
                    Sí
                  </Button>
                  <Button
                    mode={formData.realizoProceso === false ? "contained" : "outlined"}
                    onPress={() => setFormData((prev) => ({ ...prev, realizoProceso: false }))}
                    icon={formData.realizoProceso === false ? "ion:close-circle" : undefined}
                    style={{ flex: 1 }}
                    compact
                  >
                    No
                  </Button>
                </View>

                <TextInput
                  label="Código de Necesidad"
                  value={formData.codigoNecesidad}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, codigoNecesidad: text }))
                  }
                  mode="outlined"
                  style={{ marginBottom: 12 }}
                />
                <TextInput
                  label="Objeto de Contratación"
                  value={formData.objetoContratacion}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, objetoContratacion: text }))
                  }
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={{ marginBottom: 12 }}
                />
                <TextInput
                  label="Firmante"
                  value={formData.nombreFirmante}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, nombreFirmante: text }))
                  }
                  mode="outlined"
                  style={{ marginBottom: 12 }}
                />
                <TextInput
                  label="Cargo"
                  value={formData.cargoFirmante}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, cargoFirmante: text }))
                  }
                  mode="outlined"
                  style={{ marginBottom: 16 }}
                />

                <Button
                  mode="contained"
                  icon="ion:eye-outline"
                  onPress={() => setShowComprasPreview(true)}
                  style={{ marginTop: 8 }}
                >
                  Vista Previa Certificado
                </Button>
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Compras Publicas Preview Modal */}
      <Modal
        animationType="slide"
        visible={showComprasPreview}
        onRequestClose={() => setShowComprasPreview(false)}
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.outlineVariant,
            }}
          >
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              Vista Previa Certificado
            </Text>
            <Button onPress={() => setShowComprasPreview(false)}>Cerrar</Button>
          </View>
          <ComprasPublicasPreviewHtml item={item} draft={formData} />
        </View>
      </Modal>

      {/* Footer Actions — only when pending */}
      {isEditMode && (
        <Surface
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: theme.colors.surface,
            borderTopWidth: 1,
            borderTopColor: theme.colors.outlineVariant,
            flexDirection: "row",
            gap: 12,
          }}
          elevation={4}
        >
          <Button
            mode="outlined"
            onPress={() => setShowRejectDialog(true)}
            style={{ flex: 1, borderColor: theme.colors.error }}
            textColor={theme.colors.error}
            disabled={isProcessing}
          >
            Rechazar
          </Button>
          <Button
            mode="contained"
            onPress={handleAprobar}
            style={{ flex: 1 }}
            disabled={isProcessing}
            loading={isProcessing}
          >
            Aprobar Contratación
          </Button>
        </Surface>
      )}

      {/* Reject Dialog */}
      <Portal>
        <Dialog
          visible={showRejectDialog}
          onDismiss={() => setShowRejectDialog(false)}
        >
          <Dialog.Title>Rechazar Solicitud</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
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
