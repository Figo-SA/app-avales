export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  SECRETARIA: "SECRETARIA",
  DTM_EIDE: "DTM_EIDE",
  DTM: "DTM",
  PDA: "PDA",
  FINANCIERO: "FINANCIERO",
  ENTRENADOR: "ENTRENADOR",
} as const;

export type Role = keyof typeof ROLES;
