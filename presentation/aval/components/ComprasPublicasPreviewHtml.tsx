import type { ColeccionAval } from "@/core/avales/interfaces/coleccion";
import React from "react";
import { StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

interface ComprasPublicasPreviewHtmlProps {
  item: ColeccionAval;
  draft: {
    numeroCertificado: string;
    realizoProceso: boolean | null;
    codigoNecesidad: string;
    objetoContratacion: string;
    nombreFirmante: string;
    cargoFirmante: string;
    fechaEmision: string;
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatFecha(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  return d.toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const ComprasPublicasPreviewHtml = ({
  item,
  draft,
}: ComprasPublicasPreviewHtmlProps) => {
  const numero = draft.numeroCertificado?.trim() || "POR DEFINIR";
  const realizo =
    draft.realizoProceso == null
      ? "POR DEFINIR"
      : draft.realizoProceso
        ? "Si"
        : "No";
  const codigoNecesidad = draft.codigoNecesidad?.trim() || "-";
  const objeto = draft.objetoContratacion?.trim() || "-";
  const nombreFirmante = draft.nombreFirmante?.trim() || "-";
  const cargoFirmante = draft.cargoFirmante?.trim() || "-";
  const fechaEmision = formatFecha(draft.fechaEmision);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, system-ui, sans-serif; font-size: 12px; color: #1e293b; padding: 12px; background: #f1f5f9; }
    .page { background: #fff; border: 1px solid #cbd5e1; padding: 20px; border-radius: 4px; }
    h2 { text-align: center; font-size: 14px; text-transform: uppercase; margin-bottom: 4px; }
    .subtitle { text-align: center; font-size: 11px; text-transform: uppercase; color: #475569; margin-bottom: 16px; }
    .body-text { font-size: 12px; line-height: 1.6; margin-bottom: 12px; text-align: justify; }
    .firma { margin-top: 40px; }
    .firma p { margin-bottom: 2px; }
    .firma-line { border-top: 1px solid #1e293b; width: 200px; margin-bottom: 4px; }
    .firma-name { font-weight: 600; font-size: 12px; text-transform: uppercase; }
    .firma-cargo { font-size: 11px; color: #475569; text-transform: uppercase; }
    .firma-fecha { font-size: 10px; color: #64748b; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="page">
    <h2>Certificado Departamento de Compras Publicas - ${escapeHtml(numero)}</h2>
    <p class="subtitle">Certificado N.° ${escapeHtml(numero)}</p>

    <p class="body-text">
      Quien suscribe, ${escapeHtml(nombreFirmante)}, encargada del area de Compras Publicas de FDPL,
      CERTIFICO que: ${escapeHtml(realizo)} se realizó el correspondiente proceso de contratación
      publica para el evento antes mencionado, con Código de necesidad N. ${escapeHtml(codigoNecesidad)}
      y objeto de contratación: ${escapeHtml(objeto)}.
    </p>

    <p class="body-text">
      El presente certificado se emite a fin de que sirva como respaldo para la emisión
      del aval correspondiente, asi como para justificar la salida y participación en
      eventos, conforme a la normativa legal vigente y a los procedimientos internos de
      la institución.
    </p>

    <p class="body-text">
      Se extiende el presente certificado a solicitud de la parte interesada, para los
      fines pertinentes.
    </p>

    <div class="firma">
      <p>Atentamente:</p>
      <div style="margin-top: 24px;">
        <div class="firma-line"></div>
        <p class="firma-name">${escapeHtml(nombreFirmante)}</p>
        <p class="firma-cargo">${escapeHtml(cargoFirmante)}</p>
        <p class="firma-fecha">Fecha: ${escapeHtml(fechaEmision)}</p>
      </div>
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
