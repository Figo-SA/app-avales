import {
  aprobarSolicitud,
  createPda,
  getColeccionById,
  rechazarSolicitud,
} from "@/core/avales/actions/colecciones-actions";
import { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { PdaPreviewHtml } from "@/presentation/aval/components/PdaPreviewHtml";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { toast } from "@backpackapp-io/react-native-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Modal, ScrollView, View } from "react-native";
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
import { WebView } from "react-native-webview";

const TRANSPORTE_LABELS: Record<string, string> = {
  AEREO: "TRANSPORTE AEREO",
  TERRESTRE: "TRANSPORTE TERRESTRE",
  VEHICULO_PROPIO: "VEHICULO PROPIO",
  MARITIMO: "TRANSPORTE MARITIMO",
  OTRO: "OTRO",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoneda(value?: string | number): string {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "");
  if (Number.isNaN(parsed)) return "-";
  return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(parsed);
}

function formatFechaEvento(inicio?: string, fin?: string): string {
  if (!inicio) return "-";
  const start = new Date(inicio);
  const startStr = start.toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" });
  if (!fin) return startStr.toUpperCase();
  const end = new Date(fin);
  const endStr = end.toLocaleDateString("es-EC", { day: "2-digit", month: "long", year: "numeric" });
  return `${startStr} AL ${endStr}`.toUpperCase();
}

function buildSolicitudHtml(item: ColeccionAval): string {
  const evento = item.evento;
  const at = item.avalTecnico;
  const disciplina = evento.disciplina?.nombre?.toUpperCase() ?? "SIN DISCIPLINA";
  const categoria = evento.categoria?.nombre?.toUpperCase() ?? "SIN CATEGORIA";
  const genero = (evento.genero ?? "MASCULINO_FEMENINO").replace(/_/g, " - ");
  const lugar = `${evento.lugar ?? ""}, ${evento.ciudad ?? ""}, ${evento.provincia ?? ""}`.toUpperCase();
  const fechas = formatFechaEvento(evento.fechaInicio, evento.fechaFin);

  const entrenadorPrincipal = item.entrenadores?.find((e) => e.esPrincipal);
  const entrenadorNombre = entrenadorPrincipal?.entrenador
    ? (entrenadorPrincipal.entrenador.nombre ?? `${entrenadorPrincipal.entrenador.nombres ?? ""} ${entrenadorPrincipal.entrenador.apellidos ?? ""}`.trim()).toUpperCase() || "POR DEFINIR"
    : "POR DEFINIR";
  const asistente = item.entrenadores?.find((e) => !e.esPrincipal);
  const asistenteNombre = asistente?.entrenador
    ? (asistente.entrenador.nombre ?? `${asistente.entrenador.nombres ?? ""} ${asistente.entrenador.apellidos ?? ""}`.trim()).toUpperCase() || "-"
    : "-";

  const deportistas = at?.deportistasAval ?? [];
  const deportistasRows = deportistas.length === 0
    ? `<tr><td colspan="4" class="empty">Sin deportistas registrados</td></tr>`
    : deportistas.map((d, i) => {
        const dep = d.deportista;
        const nombres = dep
          ? (dep.nombre ?? `${dep.apellidos ?? ""} ${dep.nombres ?? ""}`.trim()).toUpperCase() || "SIN NOMBRE"
          : "SIN NOMBRE";
        const generoUpper = (dep?.genero ?? "").toUpperCase();
        const sexo = generoUpper === "MASCULINO" ? "M" : generoUpper === "FEMENINO" ? "F" : "-";
        return `<tr>
          <td class="num">${i + 1}</td>
          <td>${escapeHtml(nombres)}</td>
          <td>${escapeHtml(entrenadorNombre)}</td>
          <td>${sexo}</td>
        </tr>`;
      }).join("");

  const objetivos = at?.objetivos ?? [];
  const objetivosRows = objetivos.length === 0
    ? `<tr><td colspan="2" class="empty">-</td></tr>`
    : objetivos.map((o, i) => `<tr><td class="num">${i + 1}</td><td>${escapeHtml(o.descripcion ?? "-")}</td></tr>`).join("");

  const criterios = at?.criterios ?? [];
  const criteriosRows = criterios.length === 0
    ? `<tr><td colspan="2" class="empty">-</td></tr>`
    : criterios.map((c, i) => `<tr><td class="num">${i + 1}</td><td>${escapeHtml(c.descripcion ?? "-")}</td></tr>`).join("");

  const presupuestoItems = evento.presupuesto ?? [];
  const presupuestoRows = presupuestoItems.length === 0
    ? `<tr><td colspan="3" class="empty">Sin items presupuestarios</td></tr>`
    : presupuestoItems.map((p, i) =>
        `<tr><td class="num">${i + 1}</td><td>${escapeHtml(p.item?.nombre ?? "-")}</td><td class="right">${formatMoneda(p.presupuesto)}</td></tr>`
      ).join("");

  const formatFecha = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };
  const formatHora = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getHours()).padStart(2, "0")}H${String(d.getMinutes()).padStart(2, "0")}`;
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, system-ui, sans-serif; font-size: 11px; color: #1e293b; padding: 12px; background: #f1f5f9; }
    .page { background: #fff; border: 1px solid #cbd5e1; padding: 16px; margin-bottom: 16px; border-radius: 4px; }
    h2 { text-align: center; font-size: 14px; text-transform: uppercase; margin-bottom: 8px; }
    h3 { text-align: center; font-size: 12px; text-transform: uppercase; margin-bottom: 10px; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    th, td { border: 1px solid #94a3b8; padding: 4px 6px; text-align: left; font-size: 10px; }
    th { background: #e0f2fe; font-weight: 600; }
    .num { text-align: center; width: 28px; }
    .right { text-align: right; }
    .empty { text-align: center; color: #94a3b8; padding: 8px; }
    .section-title { font-size: 11px; font-weight: 600; text-transform: uppercase; margin: 10px 0 4px 0; }
    .grid-row { display: flex; gap: 4px; }
    .grid-row span { flex: 1; }
    .grid-row .label { font-weight: 600; }
    .obs { margin-top: 8px; }
    .obs-label { font-weight: 600; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="page">
    <h3>Nomina de Participantes</h3>
    <table>
      <tr><td style="width:30%; font-weight:600;">DEPORTE</td><td>${escapeHtml(disciplina)}</td></tr>
      <tr><td style="font-weight:600;">EVENTO</td><td>${escapeHtml(evento.nombre?.toUpperCase() ?? "SIN EVENTO")}</td></tr>
      <tr><td style="font-weight:600;">GENERO</td><td>${escapeHtml(genero)}</td></tr>
      <tr><td style="font-weight:600;">LUGAR Y FECHA</td><td>${escapeHtml(lugar)} / ${escapeHtml(fechas)}</td></tr>
      <tr><td style="font-weight:600;">ENTRENADOR</td><td>${escapeHtml(entrenadorNombre)}</td></tr>
      <tr><td style="font-weight:600;">CATEGORIA</td><td>${escapeHtml(categoria)}</td></tr>
    </table>
    <table>
      <thead><tr style="background:#bae6fd;"><th class="num">No.</th><th>APELLIDOS Y NOMBRES</th><th>PROFESOR</th><th>SEXO</th></tr></thead>
      <tbody>${deportistasRows}</tbody>
    </table>
  </div>

  <div class="page">
    <h2>Aval Tecnico de Participacion Competitiva</h2>
    <h3>Datos Informativos</h3>
    <table>
      <tr><td style="width:30%; font-weight:600;">DEPORTE</td><td>${escapeHtml(disciplina)}</td></tr>
      <tr><td style="font-weight:600;">CATEGORIAS</td><td>${escapeHtml(categoria)}</td></tr>
      <tr><td style="font-weight:600;">GENERO</td><td>${escapeHtml(genero)}</td></tr>
      <tr><td style="font-weight:600;">EVENTO</td><td>${escapeHtml(evento.nombre?.toUpperCase() ?? "SIN EVENTO")}</td></tr>
      <tr><td style="font-weight:600;">LUGAR Y FECHA</td><td>${escapeHtml(lugar)} / ${escapeHtml(fechas)}</td></tr>
      <tr><td style="font-weight:600;">ENTRENADOR RESPONSABLE</td><td>${escapeHtml(entrenadorNombre)}</td></tr>
      <tr><td style="font-weight:600;">ASISTENTE</td><td>${escapeHtml(asistenteNombre)}</td></tr>
    </table>

    <p class="section-title">Objetivos de Participacion</p>
    <table>
      <thead><tr><th class="num">N.</th><th>OBJETIVO</th></tr></thead>
      <tbody>${objetivosRows}</tbody>
    </table>

    <p class="section-title">Criterios de Seleccion</p>
    <table>
      <thead><tr><th class="num">N.</th><th>CRITERIO</th></tr></thead>
      <tbody>${criteriosRows}</tbody>
    </table>

    <p class="section-title">Conformacion de la Delegacion</p>
    <table>
      <thead>
        <tr>
          <th colspan="2" style="text-align:center;">OFICIALES</th>
          <th colspan="2" style="text-align:center;">ATLETAS</th>
          <th rowspan="2" style="text-align:center;">TOTAL</th>
        </tr>
        <tr>
          <th style="text-align:center;">H</th><th style="text-align:center;">M</th>
          <th style="text-align:center;">H</th><th style="text-align:center;">M</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="text-align:center;">${evento.numEntrenadoresHombres || 0}</td>
          <td style="text-align:center;">${evento.numEntrenadoresMujeres || 0}</td>
          <td style="text-align:center;">${evento.numAtletasHombres || 0}</td>
          <td style="text-align:center;">${evento.numAtletasMujeres || 0}</td>
          <td style="text-align:center;">${(evento.numEntrenadoresHombres || 0) + (evento.numEntrenadoresMujeres || 0) + (evento.numAtletasHombres || 0) + (evento.numAtletasMujeres || 0)}</td>
        </tr>
      </tbody>
    </table>

    <p class="section-title">Requerimientos</p>
    <table>
      <thead><tr><th class="num">N.</th><th>RUBRO</th><th class="right" style="width:80px;">VALOR</th></tr></thead>
      <tbody>${presupuestoRows}</tbody>
    </table>

    <p class="section-title">Logistica</p>
    <table>
      <tr>
        <td style="width:60px; font-weight:600;">SALIDA</td>
        <td>
          <div class="grid-row"><span class="label">Fecha:</span><span class="label">Hora:</span><span class="label">Transporte:</span></div>
          <div class="grid-row"><span>${formatFecha(at?.fechaHoraSalida)}</span><span>${formatHora(at?.fechaHoraSalida)}</span><span>${escapeHtml(TRANSPORTE_LABELS[at?.transporteSalida ?? ""] ?? at?.transporteSalida ?? "-")}</span></div>
        </td>
      </tr>
      <tr>
        <td style="font-weight:600;">RETORNO</td>
        <td>
          <div class="grid-row"><span class="label">Fecha:</span><span class="label">Hora:</span><span class="label">Transporte:</span></div>
          <div class="grid-row"><span>${formatFecha(at?.fechaHoraRetorno)}</span><span>${formatHora(at?.fechaHoraRetorno)}</span><span>${escapeHtml(TRANSPORTE_LABELS[at?.transporteRetorno ?? ""] ?? at?.transporteRetorno ?? "-")}</span></div>
        </td>
      </tr>
    </table>

    <div class="obs">
      <p class="obs-label">Observacion:</p>
      <p>${escapeHtml(at?.observaciones?.trim() || "-")}</p>
    </div>
  </div>
</body>
</html>`;
}

export default function PdaColeccionDetail() {
  const router = useRouter();
  const theme = useTheme();
  const params = useLocalSearchParams();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showSolicitudPreview, setShowSolicitudPreview] = useState(false);
  const [showPdaPreview, setShowPdaPreview] = useState(false);
  const [formData, setFormData] = useState({
    descripcion: "",
    numeroPda: "",
    numeroAval: "",
    codigoActividad: "",
    nombreFirmante: "",
    cargoFirmante: "Metodólogo Provincial",
  });

  // Parse initial data from params (partial, from list endpoint)
  const paramItem: ColeccionAval | null = params.data
    ? JSON.parse(params.data as string)
    : null;

  // Fetch full detail data (with nested deportistas, entrenadores, etc.)
  const { data: fullItem, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["coleccion-detail", paramItem?.id],
    queryFn: () => getColeccionById(paramItem!.id),
    enabled: !!paramItem?.id,
  });

  // Use full data if available, otherwise fall back to params data
  const item = fullItem ?? paramItem;

  // Initialize form data when item loads
  if (item && !formData.descripcion) {
    setFormData((prev) => ({
      ...prev,
      descripcion: item.descripcion,
      nombreFirmante: user ? `${user.nombre} ${user.apellido}`.trim() : "",
    }));
  }

  // Aval is pending PDA review only when etapa is SOLICITUD
  const isPendingByEtapa = item?.etapaActual === "SOLICITUD" || item?.etapa === "SOLICITUD";
  const mode = params.mode as string | undefined;
  const isEditMode = mode === "edit" && isPendingByEtapa;
  const isPending = isPendingByEtapa;

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
      "¿Estás seguro de que deseas aprobar el presupuesto de esta solicitud?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprobar",
          onPress: async () => {
            try {
              setIsProcessing(true);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              await createPda(item.id, formData);
              await aprobarSolicitud(item.id, user.id, "PDA");
              toast.success("Presupuesto aprobado correctamente");
              queryClient.invalidateQueries({ queryKey: ["colecciones"] });
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
      await rechazarSolicitud(item.id, user.id, rejectReason, "PDA");
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
            <SectionTitle title="Certificación Presupuestaria" icon="ion:receipt-outline" />
            <Card style={{ marginHorizontal: 16 }} mode="outlined">
              <Card.Content style={{ padding: 0 }}>
                {/* Table Header */}
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

                {/* Table Body */}
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

                {/* Table Footer (Total) */}
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

            {/* Vista Previa Solicitud Button */}
            <SectionTitle
              title="Documentos"
              icon="ion:documents-outline"
            />
            <Card style={{ marginHorizontal: 16 }} mode="outlined">
              <Card.Content>
                <Button
                  mode="outlined"
                  icon="ion:document-text-outline"
                  onPress={() => setShowSolicitudPreview(true)}
                  style={{ marginBottom: 12 }}
                >
                  Vista Previa Solicitud
                </Button>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4 }}>
                  Nómina de participantes, objetivos, criterios y logística del aval técnico.
                </Text>
              </Card.Content>
            </Card>
          </>
        )}

        {isEditMode && (
          <>
            <SectionTitle
              title="Generar Documento PDA"
              icon="ion:document-text-outline"
            />
            <Card style={{ marginHorizontal: 16 }} mode="outlined">
              <Card.Content>
                <TextInput
                  label="Descripción"
                  value={formData.descripcion}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, descripcion: text }))
                  }
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={{ marginBottom: 12 }}
                />
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TextInput
                    label="No. PDA"
                    value={formData.numeroPda}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, numeroPda: text }))
                    }
                    mode="outlined"
                    style={{ flex: 1, marginBottom: 12 }}
                  />
                  <TextInput
                    label="No. Aval"
                    value={formData.numeroAval}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, numeroAval: text }))
                    }
                    mode="outlined"
                    style={{ flex: 1, marginBottom: 12 }}
                  />
                </View>
                <TextInput
                  label="Cód. Actividad"
                  value={formData.codigoActividad}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, codigoActividad: text }))
                  }
                  mode="outlined"
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
                  onPress={() => setShowPdaPreview(true)}
                  style={{ marginTop: 8 }}
                >
                  Vista Previa PDA
                </Button>
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Solicitud Preview Modal */}
      <Modal
        animationType="slide"
        visible={showSolicitudPreview}
        onRequestClose={() => setShowSolicitudPreview(false)}
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
              Vista Previa Solicitud
            </Text>
            <Button onPress={() => setShowSolicitudPreview(false)}>Cerrar</Button>
          </View>
          <WebView
            source={{ html: buildSolicitudHtml(item) }}
            style={{ flex: 1 }}
            scalesPageToFit
            originWhitelist={["*"]}
          />
        </View>
      </Modal>

      {/* PDA Preview Modal */}
      <Modal
        animationType="slide"
        visible={showPdaPreview}
        onRequestClose={() => setShowPdaPreview(false)}
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
              Vista Previa PDA
            </Text>
            <Button onPress={() => setShowPdaPreview(false)}>Cerrar</Button>
          </View>
          <PdaPreviewHtml item={item} draft={formData} />
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
            Aprobar PDA
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
