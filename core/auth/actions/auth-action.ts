import { httpClient } from "@/core/api/http-client";
import { logger } from "@/core/logger";

import { toast } from "@backpackapp-io/react-native-toast";
export interface WrapperResponse<T> {
  status: string;
  message: string;
  meta: {
    requestId: string;
    timestamp: string;
    apiVersion: string;
    durationMs: number;
  };
  data: T;
}

export interface AuthResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  roles: string[];
  token: string;
}

// Función que acepta la respuesta completa del backend
const returnUserToken = (
  response: WrapperResponse<AuthResponse>
): { user: Omit<AuthResponse, "token">; token: string } => {
  const { token, ...user } = response.data; // extraemos data del wrapper
  return { user, token };
};

export const authLogin = async (email: string, password: string) => {
  email = email.trim().toLowerCase();
  try {
    const { data } = await httpClient.post<WrapperResponse<AuthResponse>>(
      "/auth/login",
      {
        email,
        password,
      }
    );
    logger.info("Login successful", data);

    return returnUserToken(data);
  } catch (error: any) {
    logger.error("Login failed", error);

    const errorMessage =
      error?.response?.data?.err ||
      error?.response?.data?.message ||
      "Error de conexión. Intenta nuevamente.";

    toast.error(errorMessage);

    throw new Error(errorMessage);
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await httpClient.get<WrapperResponse<AuthResponse>>(
      "/auth/check-status"
    );
    logger.info("Check status successful", data);
    return returnUserToken(data);
  } catch (error: any) {
    logger.info("Check status failed - user not authenticated");
    return null;
  }
};
