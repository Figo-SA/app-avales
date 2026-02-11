import {
  type Estado,
  type EtapaFlujo,
  getEstadoBadge,
  getApprovalStageLabel,
} from "@/core/constants/avales.constants";

export type { Estado, EtapaFlujo };

/**
 * Obtiene la configuración visual para un estado de aval/colección.
 * Compatible con dark mode.
 */
export const getStatusConfig = (
  estado?: string | null,
  etapa?: string | null,
  isDark = false,
) => {
  return getEstadoBadge(estado, etapa, isDark);
};

export { getApprovalStageLabel };
