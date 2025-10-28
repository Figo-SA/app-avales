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
  timeout: 10000,
  retryAttempts: 3,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    CHECK_STATUS: "/auth/check-status",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  AVALES: {
    LIST: "/avales",
    CREATE: "/avales",
    UPDATE: (id: string) => `/avales/${id}`,
    DELETE: (id: string) => `/avales/${id}`,
    GET_BY_ID: (id: string) => `/avales/${id}`,
  },
  EVENTOS: {
    LIST: "/events/paginated",
    GET_BY_ID: (id: number) => `/events/${id}`,
    UPLOAD_FILE: (id: number) => `/events/${id}/upload-file`,
  },
  USER: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
    UPDATE_PUSH_TOKEN: "/users/me/push-token",
  },
} as const;
