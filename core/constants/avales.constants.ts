/**
 * Constantes centralizadas del flujo de aprobación de avales.
 * Alineado con el frontend (Avales-frontend/lib/constants.ts).
 */

// ─── Tipos ──────────────────────────────────────────────────────────

export type Estado = "DISPONIBLE" | "BORRADOR" | "SOLICITADO" | "RECHAZADO" | "ACEPTADO";

export type EtapaFlujo =
  | "SOLICITUD"
  | "PDA"
  | "REVISION_METODOLOGO"
  | "REVISION_DTM"
  | "CONTROL_PREVIO"
  | "SECRETARIA"
  | "FINANCIERO"
  | "COMPRAS_PUBLICAS";

// ─── Flujo de aprobación ────────────────────────────────────────────

export const APPROVAL_STAGE_FLOW: EtapaFlujo[] = [
  "SOLICITUD",
  "PDA",
  "REVISION_METODOLOGO",
  "REVISION_DTM",
  "CONTROL_PREVIO",
  "SECRETARIA",
  "FINANCIERO",
  "COMPRAS_PUBLICAS",
];

export const APPROVAL_STAGE_LABELS: Record<EtapaFlujo, string> = {
  SOLICITUD: "Solicitud",
  PDA: "Revisado por el PDA",
  REVISION_METODOLOGO: "Revisado por el metodólogo",
  REVISION_DTM: "Revisado por el DTM",
  CONTROL_PREVIO: "Revisado por Control Previo",
  SECRETARIA: "Revisado por Secretaría",
  FINANCIERO: "Revisado por Financiero",
  COMPRAS_PUBLICAS: "Compras Públicas",
};

// ─── Estados ────────────────────────────────────────────────────────

export const AVAL_ESTADOS: Estado[] = [
  "DISPONIBLE",
  "BORRADOR",
  "SOLICITADO",
  "RECHAZADO",
  "ACEPTADO",
];

export const EVENTO_ESTADOS: Estado[] = [
  "DISPONIBLE",
  "SOLICITADO",
  "RECHAZADO",
  "ACEPTADO",
];

// ─── Colores para gráficas del dashboard ────────────────────────────

export const ESTADO_COLORS: Record<string, string> = {
  DISPONIBLE: "#3B82F6",
  BORRADOR: "#F59E0B",
  SOLICITADO: "#F59E0B",
  RECHAZADO: "#EF4444",
  ACEPTADO: "#10B981",
};

// ─── Configuración de badges de estado (React Native) ───────────────

export type EstadoBadgeConfig = {
  label: string;
  color: string;
  darkColor: string;
  bg: string;
  darkBg: string;
  icon: string;
};

export const ESTADO_BADGE_CONFIG: Record<Estado, EstadoBadgeConfig> = {
  DISPONIBLE: {
    label: "Disponible",
    color: "#059669",
    darkColor: "#34D399",
    bg: "#D1FAE5",
    darkBg: "#064E3B",
    icon: "ion:checkmark-circle",
  },
  BORRADOR: {
    label: "Borrador",
    color: "#D97706",
    darkColor: "#FBBF24",
    bg: "#FEF3C7",
    darkBg: "#78350F",
    icon: "ion:create-outline",
  },
  SOLICITADO: {
    label: "Pendiente",
    color: "#D97706",
    darkColor: "#FBBF24",
    bg: "#FEF3C7",
    darkBg: "#78350F",
    icon: "ion:time-outline",
  },
  ACEPTADO: {
    label: "Aprobado",
    color: "#059669",
    darkColor: "#34D399",
    bg: "#D1FAE5",
    darkBg: "#064E3B",
    icon: "ion:checkmark-circle",
  },
  RECHAZADO: {
    label: "Rechazado",
    color: "#DC2626",
    darkColor: "#F87171",
    bg: "#FEE2E2",
    darkBg: "#7F1D1D",
    icon: "ion:close-circle",
  },
};

// ─── Roles que pueden revisar/aprobar ───────────────────────────────

export const AVAL_APPROVAL_REVIEWER_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "METODOLOGO",
  "DTM",
  "PDA",
  "CONTROL_PREVIO",
  "SECRETARIA",
  "FINANCIERO",
  "COMPRAS_PUBLICAS",
] as const;

// ─── Helpers ────────────────────────────────────────────────────────

export function getApprovalStageLabel(etapa?: string | null): string {
  if (!etapa) return "Pendiente";
  return APPROVAL_STAGE_LABELS[etapa as EtapaFlujo] ?? etapa;
}

export function getNextApprovalStage(etapa?: EtapaFlujo): EtapaFlujo | undefined {
  if (!etapa) return undefined;
  const index = APPROVAL_STAGE_FLOW.indexOf(etapa);
  if (index === -1 || index === APPROVAL_STAGE_FLOW.length - 1) return undefined;
  return APPROVAL_STAGE_FLOW[index + 1];
}

export function getEstadoBadge(estado?: string | null, etapa?: string | null, isDark = false) {
  const upperEstado = (estado?.toUpperCase() || "SOLICITADO") as Estado;
  const config = ESTADO_BADGE_CONFIG[upperEstado] || ESTADO_BADGE_CONFIG.SOLICITADO;

  // Si está SOLICITADO, mostrar la etapa como label
  const label =
    upperEstado === "SOLICITADO" && etapa
      ? getApprovalStageLabel(etapa)
      : config.label;

  return {
    label,
    color: isDark ? config.darkColor : config.color,
    bg: isDark ? config.darkBg : config.bg,
    icon: config.icon,
  };
}
