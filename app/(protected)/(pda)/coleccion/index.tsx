import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
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

export default function PdaColeccionDetail() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Parse data from params
  const item = params.data ? JSON.parse(params.data as string) : null;

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
    Alert.alert(
      "Confirmar Aprobación",
      "¿Estás seguro de que deseas aprobar el presupuesto de esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar",
          onPress: async () => {
            try {
              setIsProcessing(true);
              // TODO: Call API when ready
              await new Promise((resolve) => setTimeout(resolve, 1000));
              toast.success("Presupuesto aprobado correctamente");
              router.back();
            } catch (error) {
              console.error(error);
              toast.error("Error al aprobar el presupuesto");
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleRechazar = async () => {
    if (!rejectReason.trim()) {
      toast.error("Debes ingresar un motivo de rechazo");
      return;
    }

    try {
      setIsProcessing(true);
      // TODO: Call API when ready
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Solicitud rechazada correctamente");
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
            <Chip icon="ion:location-outline" compact>
              {item.evento.ciudad}
            </Chip>
            <Chip icon="ion:calendar-outline" compact>
              {new Date(item.evento.fechaInicio).toLocaleDateString()}
            </Chip>
          </View>
        </Surface>

        {/* Presupuesto Estimado */}
        <Surface
          style={{
            marginHorizontal: 16,
            padding: 20,
            borderRadius: 12,
            backgroundColor: theme.colors.primaryContainer,
            alignItems: "center",
          }}
          elevation={0}
        >
          <Icon source="ion:cash-outline" size={32} color={theme.colors.primary} />
          <Text
            variant="headlineLarge"
            style={{ fontWeight: "bold", color: theme.colors.primary, marginTop: 8 }}
          >
            ${item.presupuestoEstimado?.toLocaleString() || "0"}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
            Presupuesto Estimado
          </Text>
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

        {/* Items de Presupuesto - Placeholder */}
        <SectionTitle title="Desglose de Presupuesto" icon="ion:receipt-outline" />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content>
            <View style={{ padding: 16, alignItems: "center" }}>
              <Icon source="ion:construct-outline" size={32} color={theme.colors.outline} />
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.outline, marginTop: 8, textAlign: "center" }}
              >
                El desglose del presupuesto estará disponible cuando se integre la API
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Footer Actions */}
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
          Aprobar PDA
        </Button>
      </Surface>

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
