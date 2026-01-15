import { Platform } from "react-native";

const STAGE = process.env.EXPO_PUBLIC_STAGE || "dev";

export const API_URL =
  STAGE === "prod"
    ? process.env.EXPO_PUBLIC_API_URL
    : Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_API_URL_IOS
    : process.env.EXPO_PUBLIC_API_URL_ANDROID;

export const API_CONFIG = {
  baseURL: API_URL || "https://api.figo.com",
  timeout: 40000,
  retryAttempts: 3,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    CHECK_STATUS: "/auth/check-status",
    PROFILE: "/auth/profile",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  AVALES: {
    LIST: "/avales",
    CREATE: "/avales",
    GET_BY_ID: (id: number) => `/avales/${id}`,
    GET_BY_EVENTO: (eventoId: number) => `/avales/evento/${eventoId}`,
    HISTORIAL: (id: number) => `/avales/${id}/historial`,
    UPLOAD_CONVOCATORIA: "/avales/convocatoria",
    UPLOAD_SOLICITUD: (id: number) => `/avales/${id}/solicitud-aval`,
    APROBAR: (id: number) => `/avales/${id}/aprobar`,
    RECHAZAR: (id: number) => `/avales/${id}/rechazar`,
    DTM_PDF: (id: number) => `/avales/${id}/dtm-pdf`,
    PDA_PDF: (id: number) => `/avales/${id}/pda-pdf`,
    DTM_PDF_BY_EVENTO: (eventoId: number) => `/avales/evento/${eventoId}/dtm-pdf`,
  },
  EVENTOS: {
    LIST: "/events",
    GET_BY_ID: (id: number) => `/events/${id}`,
    GET_COLLECTION: (id: number) => `/events/${id}/collection`,
    CREATE: "/events",
    UPDATE: (id: number) => `/events/${id}`,
    DELETE: (id: number) => `/events/${id}`,
    RESTORE: (id: number) => `/events/${id}/restore`,
  },
  ATHLETES: {
    LIST: "/athletes",
    GET_BY_ID: (id: number) => `/athletes/${id}`,
    SEARCH_BY_CEDULA: "/athletes/search/cedula",
    CREATE: "/athletes",
    UPDATE: (id: number) => `/athletes/${id}`,
    DELETE: (id: number) => `/athletes/${id}`,
    RESTORE: (id: number) => `/athletes/${id}/restore`,
  },
  USERS: {
    LIST: "/users",
    ENTRENADORES: "/users/entrenadores",
    GET_BY_ID: (id: number) => `/users/${id}`,
    UPDATE_PROFILE: "/users/profile",
    UPDATE_PUSH_TOKEN: "/users/me/push-token",
  },
  STATISTICS: {
    ALL: "/statistics",
    DASHBOARD: "/statistics/dashboard",
    AVALES_POR_ESTADO: "/statistics/avales/por-estado",
    AVALES_POR_ETAPA: "/statistics/avales/por-etapa",
    AVALES_TIMELINE: "/statistics/avales/timeline",
    AVALES_POR_DISCIPLINA: "/statistics/avales/por-disciplina",
    AVALES_POR_CATEGORIA: "/statistics/avales/por-categoria",
  },
} as const;
