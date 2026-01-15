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

export default function SecretariaColeccionDetail() {
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
      "¿Confirmas la aprobación administrativa? La solicitud pasará a Financiero.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar y Enviar",
          onPress: async () => {
            try {
              setIsProcessing(true);
              // TODO: Call API when ready
              await new Promise((resolve) => setTimeout(resolve, 1000));
              toast.success("Solicitud aprobada y enviada a Financiero");
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
    if (!rejectReason.trim()) {
      toast.error("Debes ingresar el motivo del rechazo");
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

  const ApprovalStep = ({
    title,
    subtitle,
    isApproved,
  }: {
    title: string;
    subtitle: string;
    isApproved: boolean;
  }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: isApproved
            ? theme.colors.primaryContainer
            : theme.colors.surfaceVariant,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon
          source={isApproved ? "ion:checkmark" : "ion:time-outline"}
          size={20}
          color={
            isApproved ? theme.colors.primary : theme.colors.onSurfaceVariant
          }
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="bodyLarge" style={{ fontWeight: "600" }}>
          {title}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {subtitle}
        </Text>
      </View>
      <Chip
        compact
        style={{
          backgroundColor: isApproved
            ? theme.colors.primaryContainer
            : theme.colors.surfaceVariant,
        }}
        textStyle={{
          fontSize: 10,
          color: isApproved
            ? theme.colors.onPrimaryContainer
            : theme.colors.onSurfaceVariant,
        }}
      >
        {isApproved ? "Aprobado" : "Pendiente"}
      </Chip>
    </View>
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Revisión Administrativa",
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

        {/* Resumen */}
        <View style={{ flexDirection: "row", marginHorizontal: 16, gap: 12 }}>
          <Surface
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              backgroundColor: theme.colors.primaryContainer,
              alignItems: "center",
            }}
            elevation={0}
          >
            <Text
              variant="headlineMedium"
              style={{ fontWeight: "bold", color: theme.colors.primary }}
            >
              {item.avalTecnico.atletas + item.avalTecnico.entrenadores}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
              Participantes
            </Text>
          </Surface>

          <Surface
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              backgroundColor: theme.colors.secondaryContainer,
              alignItems: "center",
            }}
            elevation={0}
          >
            <Text
              variant="headlineMedium"
              style={{ fontWeight: "bold", color: theme.colors.secondary }}
            >
              ${(item.presupuestoAprobado / 1000).toFixed(0)}K
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer }}>
              Presupuesto
            </Text>
          </Surface>
        </View>

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

        {/* Flujo de Aprobaciones */}
        <SectionTitle title="Flujo de Aprobaciones" icon="ion:git-branch-outline" />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content>
            <ApprovalStep
              title="Revisión DTM"
              subtitle="Aprobación técnica metodológica"
              isApproved={item.aprobaciones.dtm}
            />
            <Divider />
            <ApprovalStep
              title="Aprobación PDA"
              subtitle="Presupuesto asignado"
              isApproved={item.aprobaciones.pda}
            />
            <Divider />
            <ApprovalStep
              title="Control Previo"
              subtitle="Documentación verificada"
              isApproved={item.aprobaciones.controlPrevio}
            />
            <Divider />
            <ApprovalStep
              title="Secretaría"
              subtitle="Revisión administrativa final"
              isApproved={false}
            />
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
          icon="ion:send-outline"
        >
          Enviar a Financiero
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
              Indica el motivo del rechazo administrativo:
            </Text>
            <TextInput
              label="Motivo"
              value={rejectReason}
              onChangeText={setRejectReason}
              mode="outlined"
              multiline
              numberOfLines={4}
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
