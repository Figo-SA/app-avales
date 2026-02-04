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
import * as WebBrowser from "expo-web-browser";
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
    useTheme
} from "react-native-paper";

export default function ControlPrevioColeccionDetail() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  //  // Parse data from params
  const item: ColeccionAval | null = params.data
    ? JSON.parse(params.data as string)
    : null;

  // Determine if the item is editable based on the current stage
  const isEditable = item?.etapa === "COMPRAS_PUBLICAS";

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
      "Aprobar Control Previo",
      "¿Has verificado que todo el expediente cumple con la normativa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar",
          onPress: async () => {
            try {
              setIsProcessing(true);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await aprobarSolicitud(item.id, user.id, "CONTROL_PREVIO");
              toast.success("Expediente aprobado para Financiero");
              queryClient.invalidateQueries({ queryKey: ["colecciones"] });
              router.back();
            } catch (error) {
              console.error(error);
              toast.error("Error al aprobar el expediente");
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
      await rechazarSolicitud(item.id, user.id, rejectReason, "CONTROL_PREVIO");
      toast.success("Expediente devuelto por inconsistencias");
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

  const TimelineItem = ({
    label,
    date,
    isCompleted,
    isLast = false,
  }: {
    label: string;
    date: string;
    isCompleted: boolean;
    isLast?: boolean;
  }) => (
    <View style={{ flexDirection: "row", height: isLast ? 24 : 48 }}>
      <View style={{ alignItems: "center", marginRight: 12, width: 20 }}>
        <Icon
          source={isCompleted ? "ion:checkmark-circle" : "ion:ellipse-outline"}
          size={20}
          color={isCompleted ? theme.colors.primary : theme.colors.outline}
        />
        {!isLast && (
          <View
            style={{
              width: 2,
              flex: 1,
              backgroundColor: isCompleted
                ? theme.colors.primary
                : theme.colors.outlineVariant,
              marginVertical: 4,
            }}
          />
        )}
      </View>
      <View>
        <Text
          variant="bodyMedium"
          style={{
            fontWeight: isCompleted ? "bold" : "regular",
            color: isCompleted ? theme.colors.onSurface : theme.colors.onSurfaceVariant,
          }}
        >
          {label}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {date}
        </Text>
      </View>
    </View>
  );

  const calculateTotalBudget = () => {
    if (!item.avalTecnico?.requerimientos) return 0;
    return item.avalTecnico.requerimientos.reduce(
      (acc: number, req: any) => acc + (Number(req.cantidadDias) * Number(req.valorUnitario)),
      0
    );
  };
  
  const totalBudget = calculateTotalBudget();

  return (
    <ThemedView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Revisión de Documentación",
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
              {item.avalTecnico ? (item.avalTecnico.atletas + item.avalTecnico.entrenadores) : 0}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onPrimaryContainer }}>
              Participantes
            </Text>
          </Surface>

          {/* Placeholder for budget since we don't have it in interface yet */}
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
              ${totalBudget > 0 ? totalBudget.toLocaleString() : "0.00"}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSecondaryContainer }}>
              Total a Pagar
            </Text>
          </Surface>
        </View>

        {/* Trazabilidad */}
        <SectionTitle title="Trazabilidad" icon="ion:git-network-outline" />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content>
            <TimelineItem
              label="Solicitud (Entrenador)"
              date={new Date(item.createdAt).toLocaleDateString()}
              isCompleted={true}
            />
            <TimelineItem
              label="Aprobación Técnica (DTM)"
              date={item.dtmUrl ? "Completado" : "Pendiente"}
              isCompleted={!!item.dtmUrl}
            />
            <TimelineItem
              label="Certificación PDA"
              date={item.pdaUrl ? "Completado" : "Pendiente"}
              isCompleted={!!item.pdaUrl}
            />
            <TimelineItem
              label="Validación Compras Públicas"
              date="Completado"
              isCompleted={true}
              isLast
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

        {/* Checklist de Documentos */}

        {/* Expediente Digital */}
        <SectionTitle title="Expediente Digital" icon="ion:folder-open-outline" />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content style={{ gap: 12 }}>
            <Button
              mode="contained-tonal"
              icon="ion:document-text-outline"
              onPress={() => openDocument(item.dtmUrl)}
              disabled={!item.dtmUrl}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              Aval Técnico (DTM)
            </Button>
            <Button
              mode="contained-tonal"
              icon="ion:ribbon-outline"
              onPress={() => openDocument(item.pdaUrl)}
              disabled={!item.pdaUrl}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              Certificación PDA
            </Button>
            <Button
              mode="contained-tonal"
              icon="ion:megaphone-outline"
              onPress={() => openDocument(item.convocatoriaUrl)}
              disabled={!item.convocatoriaUrl}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              Convocatoria Oficial
            </Button>
            <Button
              mode="contained-tonal"
              icon="ion:paper-plane-outline"
              onPress={() => openDocument(item.solicitudUrl)}
              disabled={!item.solicitudUrl}
              contentStyle={{ justifyContent: "flex-start" }}
            >
              Solicitud Inicial
            </Button>
          </Card.Content>
        </Card>

        {/* Observaciones */}
        <SectionTitle title="Observaciones" icon="ion:create-outline" />
        <Card style={{ marginHorizontal: 16 }} mode="outlined">
          <Card.Content>
            <View style={{ padding: 8, alignItems: "center" }}>
              <Icon source="ion:chatbox-ellipses-outline" size={32} color={theme.colors.outline} />
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.outline, marginTop: 8, textAlign: "center" }}
              >
                Puedes agregar observaciones al rechazar la solicitud
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Footer Actions - Only if editable */}
      {isEditable ? (
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
      ) : (
        <Surface
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            backgroundColor: theme.colors.surfaceVariant,
            alignItems: "center",
          }}
          elevation={4}
        >
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "bold" }}>
             Solicitud ya procesada ({item?.etapa})
          </Text>
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
              Indica qué documentación falta o tiene errores:
            </Text>
            <TextInput
              label="Observaciones"
              value={rejectReason}
              onChangeText={setRejectReason}
              mode="outlined"
              multiline
              numberOfLines={4}
              placeholder="Ej: Falta firma en el documento de convocatoria..."
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
