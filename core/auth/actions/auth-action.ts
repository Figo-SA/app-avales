import { httpClient } from "@/core/api/http-client";
import { logger } from "@/core/logger";

import { toast } from "@backpackapp-io/react-native-toast";
import { User } from "../interface/user";

export interface AuthResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula: string;
  roles: string[];
  token: string;
}

const returnUserToken = (
  data: AuthResponse
): {
  user: User;
  token: string;
} => {
  const { token, ...user } = data;

  return {
    user,
    token,
  };
};

export const authLogin = async (email: string, password: string) => {
  email = email.trim().toLowerCase();
  try {
    const { data } = await httpClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

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
    const { data } = await httpClient.get<AuthResponse>("/auth/check-status");
    logger.info("Check status successful", data);
    return returnUserToken(data);
  } catch (error: any) {
    logger.info("Check status failed - user not authenticated");
    return null;
  }
};
