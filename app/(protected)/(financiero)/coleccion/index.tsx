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

export default function FinancieroColeccionDetail() {
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
      "Confirmar Pago",
      `¿Confirmas la aprobación del pago por $${item.presupuestoAprobado.toLocaleString()}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar Pago",
          onPress: async () => {
            try {
              setIsProcessing(true);
              // TODO: Call API when ready
              await new Promise((resolve) => setTimeout(resolve, 1000));
              toast.success("Pago aprobado correctamente. Aval completado.");
              router.back();
            } catch (error) {
              console.error(error);
              toast.error("Error al aprobar el pago");
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
      toast.success("Pago rechazado correctamente");
      setShowRejectDialog(false);
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Error al rechazar el pago");
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
          title: "Aprobación de Pago",
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

        {/* Monto a Pagar */}
        <Surface
          style={{
            marginHorizontal: 16,
            padding: 24,
            borderRadius: 16,
            backgroundColor: theme.colors.primary,
            alignItems: "center",
          }}
          elevation={2}
        >
          <Icon source="ion:cash-outline" size={40} color={theme.colors.onPrimary} />
          <Text
            variant="displaySmall"
            style={{ fontWeight: "bold", color: theme.colors.onPrimary, marginTop: 12 }}
          >
            ${item.presupuestoAprobado?.toLocaleString() || "0"}
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onPrimary, opacity: 0.8 }}>
            Monto Total a Pagar
          </Text>
          <Chip
            style={{ marginTop: 12, backgroundColor: "rgba(255,255,255,0.2)" }}
            textStyle={{ color: theme.colors.onPrimary }}
          >
            Aprobado por todas las instancias
          </Chip>
        </Surface>

        <SectionTitle
          title="Datos Bancarios"
          icon="ion:card-outline"
        />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content>
            <InfoRow label="Beneficiario" value={item.datosFinancieros?.beneficiario || "N/A"} />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow label="RUC" value={item.datosFinancieros?.ruc || "N/A"} />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow label="Banco" value={item.datosFinancieros?.banco || "N/A"} />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow label="Tipo de Cuenta" value={item.datosFinancieros?.tipoCuenta || "N/A"} />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow label="Número de Cuenta" value={item.datosFinancieros?.numeroCuenta || "N/A"} />
          </Card.Content>
        </Card>

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

        {/* Participantes */}
        <SectionTitle title="Participantes" icon="ion:people-outline" />
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
              {item.avalTecnico.atletas}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
              Atletas
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
              {item.avalTecnico.entrenadores}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer }}>
              Entrenadores
            </Text>
          </Surface>
        </View>

        {/* Verificación */}
        <SectionTitle title="Verificación" icon="ion:checkbox-outline" />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 8,
              }}
            >
              <Icon source="ion:checkmark-circle" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  Aprobación DTM
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Revisión técnica completada
                </Text>
              </View>
            </View>
            <Divider />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 8,
              }}
            >
              <Icon source="ion:checkmark-circle" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  Aprobación PDA
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Presupuesto asignado
                </Text>
              </View>
            </View>
            <Divider />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 8,
              }}
            >
              <Icon source="ion:checkmark-circle" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  Control Previo
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Documentación verificada
                </Text>
              </View>
            </View>
            <Divider />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 8,
              }}
            >
              <Icon source="ion:checkmark-circle" size={24} color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <Text variant="bodyMedium" style={{ fontWeight: "600" }}>
                  Aprobación Secretaría
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Revisión administrativa completada
                </Text>
              </View>
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
          icon="ion:checkmark-circle-outline"
        >
          Aprobar Pago
        </Button>
      </Surface>

      {/* Reject Dialog */}
      <Portal>
        <Dialog
          visible={showRejectDialog}
          onDismiss={() => setShowRejectDialog(false)}
        >
          <Dialog.Title>Rechazar Pago</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 12 }}>
              Indica el motivo por el que se rechaza el pago:
            </Text>
            <TextInput
              label="Motivo"
              value={rejectReason}
              onChangeText={setRejectReason}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Ej: Datos bancarios incorrectos..."
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
