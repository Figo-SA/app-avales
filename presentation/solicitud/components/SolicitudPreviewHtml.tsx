import type { Evento } from "@/core/eventos/interfaces/evento";
import type { Participante } from "@/core/participants/interfaces/participante";
import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

const TRANSPORTE_LABELS: Record<string, string> = {
  AEREO: "TRANSPORTE AEREO",
  TERRESTRE: "TRANSPORTE TERRESTRE",
  VEHICULO_PROPIO: "VEHICULO PROPIO",
  MARITIMO: "TRANSPORTE MARITIMO",
  OTRO: "OTRO",
};

function formatFecha(date?: Date | null): string {
  if (!date) return "-";
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

function formatHora(date?: Date | null): string {
  if (!date) return "-";
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}H${mm}`;
}

function formatFechaEvento(inicio?: string, fin?: string): string {
  if (!inicio) return "-";
  const start = new Date(inicio);
  const startStr = start.toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  if (!fin) return startStr.toUpperCase();
  const end = new Date(fin);
  const endStr = end.toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return `${startStr} AL ${endStr}`.toUpperCase();
}

function formatMoneda(value?: string): string {
  const parsed = Number.parseFloat(value ?? "");
  if (Number.isNaN(parsed)) return "-";
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(parsed);
}

interface SolicitudPreviewHtmlProps {
  evento: Evento;
  formData: {
    fechaSalida?: Date | null;
    fechaRetorno?: Date | null;
    lugarSalida: string;
    lugarRetorno: string;
    transporteSalida: string;
    transporteRetorno: string;
    objetivos: string[];
    criterios: string[];
    observaciones?: string;
  };
  deportistas: Participante[];
  entrenadores: Participante[];
}

export const SolicitudPreviewHtml = ({
  evento,
  formData,
  deportistas,
  entrenadores,
}: SolicitudPreviewHtmlProps) => {
  const disciplina = evento.disciplina?.nombre?.toUpperCase() ?? "SIN DISCIPLINA";
  const categoria = evento.categoria?.nombre?.toUpperCase() ?? "SIN CATEGORIA";
  const genero = (evento.genero ?? "MASCULINO_FEMENINO").replace(/_/g, " - ");
  const entrenadorResponsable = entrenadores[0]
    ? `${entrenadores[0].nombres} ${entrenadores[0].apellidos}`.toUpperCase()
    : "POR DEFINIR";
  const asistente = entrenadores[1]
    ? `${entrenadores[1].nombres} ${entrenadores[1].apellidos}`.toUpperCase()
    : "-";
  const lugar = `${evento.lugar}, ${evento.ciudad}, ${evento.provincia}`.toUpperCase();
  const presupuestoItems = evento.presupuesto ?? [];

  const objetivosRows = formData.objetivos
    .filter((o) => o.trim())
    .map(
      (obj, i) =>
        `<tr><td class="num">${i + 1}</td><td>${escapeHtml(obj)}</td></tr>`
    )
    .join("");

  const criteriosRows = formData.criterios
    .filter((c) => c.trim())
    .map(
      (crit, i) =>
        `<tr><td class="num">${i + 1}</td><td>${escapeHtml(crit)}</td></tr>`
    )
    .join("");

  const deportistasRows =
    deportistas.length === 0
      ? `<tr><td colspan="4" class="empty">Sin deportistas seleccionados</td></tr>`
      : deportistas
          .map(
            (d, i) =>
              `<tr>
                <td class="num">${i + 1}</td>
                <td>${escapeHtml(`${d.apellidos} ${d.nombres}`.toUpperCase())}</td>
                <td>${escapeHtml(entrenadorResponsable)}</td>
                <td>${d.sexo === "masculino" ? "M" : "F"}</td>
              </tr>`
          )
          .join("");

  const presupuestoRows =
    presupuestoItems.length === 0
      ? `<tr><td colspan="3" class="empty">Sin items presupuestarios</td></tr>`
      : presupuestoItems
          .map(
            (item, i) =>
              `<tr>
                <td class="num">${i + 1}</td>
                <td>${escapeHtml(item.item.nombre)}</td>
                <td class="right">${formatMoneda(item.presupuesto)}</td>
              </tr>`
          )
          .join("");

  const html = `<!DOCTYPE html>
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
  <!-- Nomina -->
  <div class="page">
    <h3>Nomina de Participantes</h3>
    <table>
      <tr><td style="width:30%; font-weight:600;">DEPORTE</td><td>${escapeHtml(disciplina)}</td></tr>
      <tr><td style="font-weight:600;">EVENTO</td><td>${escapeHtml(evento.nombre?.toUpperCase() ?? "SIN EVENTO")}</td></tr>
      <tr><td style="font-weight:600;">GENERO</td><td>${escapeHtml(genero)}</td></tr>
      <tr><td style="font-weight:600;">LUGAR Y FECHA</td><td>${escapeHtml(lugar)} / ${escapeHtml(formatFechaEvento(evento.fechaInicio, evento.fechaFin))}</td></tr>
      <tr><td style="font-weight:600;">ENTRENADOR</td><td>${escapeHtml(entrenadorResponsable)}</td></tr>
      <tr><td style="font-weight:600;">CATEGORIA</td><td>${escapeHtml(categoria)}</td></tr>
    </table>
    <table>
      <thead><tr style="background:#bae6fd;"><th class="num">No.</th><th>APELLIDOS Y NOMBRES</th><th>PROFESOR</th><th>SEXO</th></tr></thead>
      <tbody>${deportistasRows}</tbody>
    </table>
  </div>

  <!-- Solicitud Tecnica -->
  <div class="page">
    <h2>Aval Tecnico de Participacion Competitiva</h2>
    <h3>Datos Informativos</h3>
    <table>
      <tr><td style="width:30%; font-weight:600;">DEPORTE</td><td>${escapeHtml(disciplina)}</td></tr>
      <tr><td style="font-weight:600;">CATEGORIAS</td><td>${escapeHtml(categoria)}</td></tr>
      <tr><td style="font-weight:600;">GENERO</td><td>${escapeHtml(genero)}</td></tr>
      <tr><td style="font-weight:600;">EVENTO</td><td>${escapeHtml(evento.nombre?.toUpperCase() ?? "SIN EVENTO")}</td></tr>
      <tr><td style="font-weight:600;">LUGAR Y FECHA</td><td>${escapeHtml(lugar)} / ${escapeHtml(formatFechaEvento(evento.fechaInicio, evento.fechaFin))}</td></tr>
      <tr><td style="font-weight:600;">ENTRENADOR RESPONSABLE</td><td>${escapeHtml(entrenadorResponsable)}</td></tr>
      <tr><td style="font-weight:600;">ASISTENTE</td><td>${escapeHtml(asistente)}</td></tr>
    </table>

    <p class="section-title">Objetivos de Participacion</p>
    <table>
      <thead><tr><th class="num">N.</th><th>OBJETIVO</th></tr></thead>
      <tbody>${objetivosRows || `<tr><td colspan="2" class="empty">-</td></tr>`}</tbody>
    </table>

    <p class="section-title">Criterios de Seleccion</p>
    <table>
      <thead><tr><th class="num">N.</th><th>CRITERIO</th></tr></thead>
      <tbody>${criteriosRows || `<tr><td colspan="2" class="empty">-</td></tr>`}</tbody>
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
          <th style="text-align:center;">H</th>
          <th style="text-align:center;">M</th>
          <th style="text-align:center;">H</th>
          <th style="text-align:center;">M</th>
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
          <div class="grid-row"><span>${formatFecha(formData.fechaSalida)}</span><span>${formatHora(formData.fechaSalida)}</span><span>${escapeHtml(TRANSPORTE_LABELS[formData.transporteSalida] ?? formData.transporteSalida)}</span></div>
        </td>
      </tr>
      <tr>
        <td style="font-weight:600;">RETORNO</td>
        <td>
          <div class="grid-row"><span class="label">Fecha:</span><span class="label">Hora:</span><span class="label">Transporte:</span></div>
          <div class="grid-row"><span>${formatFecha(formData.fechaRetorno)}</span><span>${formatHora(formData.fechaRetorno)}</span><span>${escapeHtml(TRANSPORTE_LABELS[formData.transporteRetorno] ?? formData.transporteRetorno)}</span></div>
        </td>
      </tr>
    </table>

    <div class="obs">
      <p class="obs-label">Observacion:</p>
      <p>${escapeHtml(formData.observaciones?.trim() || "-")}</p>
    </div>
  </div>
</body>
</html>`;

  return (
    <WebView
      source={{ html }}
      style={styles.webview}
      scalesPageToFit
      originWhitelist={["*"]}
    />
  );
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
