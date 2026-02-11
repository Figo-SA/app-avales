import {
    aprobarSolicitud,
    rechazarSolicitud,
} from "@/core/avales/actions/colecciones-actions";
import { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
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
        toast.error("Usuario no identificado");
        return;
    }

    Alert.alert(
      "Generar Resolución y Pasar",
      "¿Confirmas que el oficio está listo y el trámite puede pasar a Financiero?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar y Enviar",
          onPress: async () => {
            try {
              setIsProcessing(true);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await aprobarSolicitud(item.id, user.id, "SECRETARIA");
              toast.success("Tramite despachado a Financiero");
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
        toast.error("Usuario no identificado");
        return;
    }

    if (!rejectReason.trim()) {
      toast.error("Debes ingresar el motivo del rechazo");
      return;
    }

    try {
      setIsProcessing(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await rechazarSolicitud(item.id, user.id, rejectReason, "SECRETARIA");
      toast.success("Trámite devuelto para corrección");
      queryClient.invalidateQueries({ queryKey: ["colecciones"] });
      setShowRejectDialog(false);
      router.back();
    } catch (error) {
      console.error(error);
      toast.error("Error al rechazar");
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

  const totalBudget = item.evento.presupuesto?.reduce(
    (sum, p) => sum + Number(p.presupuesto),
    0
  ) || 0;

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Despacho de Resolución",
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
          <View style={{ marginBottom: 16 }}>
            <Chip
              icon="ion:shield-checkmark"
              style={{
                backgroundColor: "#DCFCE7",
                alignSelf: "flex-start",
                marginBottom: 12,
              }}
              textStyle={{ color: "#166534", fontWeight: "bold" }}
            >
              Auditado Correctamente
            </Chip>
            <Text
              variant="headlineSmall"
              style={{ fontWeight: "bold", marginBottom: 8 }}
            >
              {item.evento.nombre}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {item.descripcion}
            </Text>
          </View>
        </Surface>

        {/* Datos para Resolución */}
        <SectionTitle title="Datos para Resolución" icon="ion:document-text-outline" />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content>
            <InfoRow label="Evento" value={item.evento.nombre} />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow 
               label="Lugar" 
               value={`${item.evento.ciudad}, ${item.evento.provincia}`} 
            />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow
              label="Vigencia"
              value={`${new Date(item.evento.fechaInicio).toLocaleDateString()}`}
            />
            <Divider style={{ marginVertical: 8 }} />
            <InfoRow
               label="Monto Autorizado"
               value={`$${totalBudget > 0 ? totalBudget.toLocaleString() : "0.00"}`}
            />
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
