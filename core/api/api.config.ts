import { Platform } from "react-native";

const STAGE = process.env.EXPO_PUBLIC_STAGE || "dev";

export const API_URL =
  STAGE === "prod"
    ? process.env.EXPO_PUBLIC_API_URL
    : Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_API_URL_IOS
    : process.env.EXPO_PUBLIC_API_URL_ANDROID;

export const API_CONFIG = {
  baseURL: API_URL || 'https://api.figo.com',
  timeout: 10000,
  retryAttempts: 3,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    CHECK_STATUS: '/auth/check-status',
  },
  AVALES: {
    LIST: '/avales',
    CREATE: '/avales',
    UPDATE: (id: string) => `/avales/${id}`,
    DELETE: (id: string) => `/avales/${id}`,
    GET_BY_ID: (id: string) => `/avales/${id}`,
  },
  EVENTOS: {
    LIST: '/eventos',
    GET_BY_ID: (id: number) => `/eventos/${id}`,
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
  },
} as const;
