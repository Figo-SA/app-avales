import type { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface PdaPreviewHtmlProps {
  item: ColeccionAval;
  draft: {
    descripcion: string;
    numeroPda: string;
    numeroAval: string;
    codigoActividad: string;
    nombreFirmante: string;
    cargoFirmante: string;
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMoneda(value?: string | number): string {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "");
  if (Number.isNaN(parsed)) return "$0.00";
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(parsed);
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

export const PdaPreviewHtml = ({ item, draft }: PdaPreviewHtmlProps) => {
  const evento = item.evento;
  const disciplina = evento.disciplina?.nombre?.toUpperCase() ?? "SIN DISCIPLINA";
  const categoria = evento.categoria?.nombre?.toUpperCase() ?? "SIN CATEGORIA";
  const lugar = `${evento.lugar}, ${evento.ciudad}, ${evento.provincia}`.toUpperCase();
  const fechas = formatFechaEvento(evento.fechaInicio, evento.fechaFin);

  const entrenadorPrincipal = item.entrenadores?.find((e) => e.esPrincipal);
  const entrenadorNombre = entrenadorPrincipal
    ? `${entrenadorPrincipal.entrenador.nombres} ${entrenadorPrincipal.entrenador.apellidos}`.toUpperCase()
    : "POR DEFINIR";
  const entrenadorCedula = entrenadorPrincipal?.entrenador.cedula ?? "-";

  const totalParticipantes =
    (evento.numAtletasHombres || 0) +
    (evento.numAtletasMujeres || 0) +
    (evento.numEntrenadoresHombres || 0) +
    (evento.numEntrenadoresMujeres || 0);

  const presupuestoItems = evento.presupuesto ?? [];
  const totalPresupuesto = presupuestoItems.reduce(
    (sum, p) => sum + Number(p.presupuesto),
    0
  );

  const presupuestoRows =
    presupuestoItems.length === 0
      ? `<tr><td colspan="4" class="empty">Sin items presupuestarios</td></tr>`
      : presupuestoItems
          .map(
            (p, i) =>
              `<tr>
                <td class="num">${i + 1}</td>
                <td>${escapeHtml(p.item.nombre)}</td>
                <td class="center">${p.item.numero}</td>
                <td class="right">${formatMoneda(p.presupuesto)}</td>
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
    h2 { text-align: center; font-size: 14px; text-transform: uppercase; margin-bottom: 4px; }
    h3 { text-align: center; font-size: 11px; text-transform: uppercase; margin-bottom: 10px; color: #475569; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    th, td { border: 1px solid #94a3b8; padding: 4px 6px; text-align: left; font-size: 10px; }
    th { background: #e0f2fe; font-weight: 600; }
    .num { text-align: center; width: 28px; }
    .center { text-align: center; }
    .right { text-align: right; }
    .empty { text-align: center; color: #94a3b8; padding: 8px; }
    .desc { margin-bottom: 12px; line-height: 1.5; }
    .firma { margin-top: 40px; text-align: center; }
    .firma-line { border-top: 1px solid #1e293b; width: 200px; margin: 0 auto 4px auto; }
    .firma-name { font-weight: 600; font-size: 11px; }
    .firma-cargo { font-size: 10px; color: #475569; }
    .total-row { background: #f0f9ff; font-weight: 600; }
  </style>
</head>
<body>
  <div class="page">
    <h2>CERTIFICACION EVENTOS PDA ${new Date().getFullYear()}</h2>
    <h3>${escapeHtml(draft.numeroPda ? `No. PDA: ${draft.numeroPda}` : "")}</h3>

    <p class="desc">${escapeHtml(draft.descripcion || item.descripcion || "")}</p>

    <table>
      <tr><td style="width:35%; font-weight:600;">DISCIPLINA</td><td>${escapeHtml(disciplina)}</td></tr>
      <tr><td style="font-weight:600;">EVENTO</td><td>${escapeHtml(evento.nombre?.toUpperCase() ?? "SIN EVENTO")}</td></tr>
      <tr><td style="font-weight:600;">No. PARTICIPANTES</td><td>${totalParticipantes}</td></tr>
      <tr><td style="font-weight:600;">CATEGORIA</td><td>${escapeHtml(categoria)}</td></tr>
      <tr><td style="font-weight:600;">LUGAR</td><td>${escapeHtml(lugar)}</td></tr>
      <tr><td style="font-weight:600;">FECHA</td><td>${escapeHtml(fechas)}</td></tr>
      <tr><td style="font-weight:600;">ENTRENADOR RESPONSABLE</td><td>${escapeHtml(entrenadorNombre)}</td></tr>
      <tr><td style="font-weight:600;">CEDULA</td><td>${escapeHtml(entrenadorCedula)}</td></tr>
      <tr><td style="font-weight:600;">CODIGO ACTIVIDAD</td><td>${escapeHtml(draft.codigoActividad || "-")}</td></tr>
      <tr><td style="font-weight:600;">No. AVAL</td><td>${escapeHtml(draft.numeroAval || "-")}</td></tr>
      <tr><td style="font-weight:600;">FONDOS</td><td>FISCALES</td></tr>
    </table>

    <table>
      <thead>
        <tr>
          <th class="num">No.</th>
          <th>ITEM PRESUPUESTARIO</th>
          <th class="center">NUMERO</th>
          <th class="right" style="width:80px;">VALOR</th>
        </tr>
      </thead>
      <tbody>
        ${presupuestoRows}
        <tr class="total-row">
          <td colspan="3" style="text-align:right; font-weight:600;">TOTAL</td>
          <td class="right">${formatMoneda(totalPresupuesto)}</td>
        </tr>
      </tbody>
    </table>

    <div class="firma">
      <div class="firma-line"></div>
      <p class="firma-name">${escapeHtml(draft.nombreFirmante || "-")}</p>
      <p class="firma-cargo">${escapeHtml(draft.cargoFirmante || "-")}</p>
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

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
