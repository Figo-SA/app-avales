import {
    aprobarSolicitud,
    rechazarSolicitud,
} from "@/core/avales/actions/colecciones-actions";
import { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Linking, ScrollView, View } from "react-native";
import {
    Button,
    Card,
    Chip,
    Dialog,
    Divider,
    Icon,
    List,
    Portal,
    Surface,
    Text,
    TextInput,
    useTheme
} from "react-native-paper";

import { useAuthStore } from "@/presentation/auth/store/useAuthStore";

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
      "¿Estás seguro de que deseas aprobar esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar",
          onPress: async () => {
            try {
              setIsProcessing(true);
              await aprobarSolicitud(item.eventoId, user.id);
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
      await rechazarSolicitud(item.eventoId, user.id, rejectReason);
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


      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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
            <Chip icon="location-outline" compact>
              {item.evento.ciudad}
            </Chip>
            <Chip icon="calendar-outline" compact>
              {new Date(item.evento.fechaInicio).toLocaleDateString()}
            </Chip>
          </View>
        </Surface>

        <SectionTitle
          title="Información del Evento"
          icon="information-circle-outline"
        />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content>
            <InfoRow label="Código" value={item.evento.codigo} />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow label="Tipo" value={item.evento.tipoEvento} />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow label="Lugar" value={item.evento.lugar} />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow label="Alcance" value={item.evento.alcance} />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow label="Provincia" value={item.evento.provincia} />
          </Card.Content>
        </Card>

        <SectionTitle title="Aval Técnico" icon="list-outline" />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content>
            <InfoRow
              label="Salida"
              value={`${new Date(
                item.avalTecnico.fechaHoraSalida
              ).toLocaleString()} (${item.avalTecnico.transporteSalida})`}
            />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow
              label="Retorno"
              value={`${new Date(
                item.avalTecnico.fechaHoraRetorno
              ).toLocaleString()} (${item.avalTecnico.transporteRetorno})`}
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
                  {item.avalTecnico.atletas}
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
                  {item.avalTecnico.entrenadores}
                </Text>
                <Text variant="bodySmall">Entrenadores</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <SectionTitle title="Documentos" icon="documents-outline" />
        <Surface style={{ marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' }} elevation={1}>
          {item.dtmUrl ? (
            <List.Item
              title="Aval DTM"
              description="Ver documento PDF"
              left={(props: any) => <List.Icon {...props} icon="document-text-outline" color={theme.colors.primary} />}
              right={(props: any) => <List.Icon {...props} icon="open-outline" />}
              onPress={() => Linking.openURL(item.dtmUrl)}
              style={{ backgroundColor: theme.colors.surface }}
            />
          ) : null}
          {item.dtmUrl && (item.solicitudUrl || item.pdaUrl) && <Divider />}
          
          {item.solicitudUrl ? (
            <List.Item
              title="Solicitud Original"
              description="Ver documento de solicitud"
              left={(props: any) => <List.Icon {...props} icon="document-outline" color={theme.colors.primary} />}
              right={(props: any) => <List.Icon {...props} icon="open-outline" />}
              onPress={() => Linking.openURL(item.solicitudUrl)}
              style={{ backgroundColor: theme.colors.surface }}
            />
          ) : null}
          {item.solicitudUrl && item.pdaUrl && <Divider />}

          {item.pdaUrl ? (
            <List.Item
              title="Certificación PDA"
              description="Ver certificación"
              left={(props: any) => <List.Icon {...props} icon="ribbon-outline" color={theme.colors.primary} />}
              right={(props: any) => <List.Icon {...props} icon="open-outline" />}
              onPress={() => Linking.openURL(item.pdaUrl)}
              style={{ backgroundColor: theme.colors.surface }}
            />
          ) : null}
          {item.pdaUrl && item.aval && <Divider />}

          {item.aval ? (
            <List.Item
              title="Aval Firmado"
              description="Descargar documento aprobado"
              left={(props: any) => <List.Icon {...props} icon="checkmark-circle-outline" color={theme.colors.primary} />}
              right={(props: any) => <List.Icon {...props} icon="cloud-download-outline" />}
              onPress={() => Linking.openURL(item.aval!)}
              style={{ backgroundColor: theme.colors.surface }}
            />
          ) : null}

          {!item.dtmUrl && !item.solicitudUrl && !item.pdaUrl && !item.aval && (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                No hay documentos disponibles
              </Text>
            </View>
          )}
        </Surface>
      </ScrollView>

      {/* Footer Actions - Only show if pending */}
      {item.evento.estado !== "ACEPTADO" && item.evento.estado !== "RECHAZADO" && (
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
            Aprobar
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
