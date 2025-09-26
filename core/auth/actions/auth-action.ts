import { httpClient } from "@/core/api/http-client";
import { logger } from "@/core/logger";
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
  } catch (error) {
    throw new Error("Login failed. Please check your credentials.");
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await httpClient.get<AuthResponse>("/auth/check-status");
    logger.info("Check status successful", data);
    return returnUserToken(data);
  } catch (error: any) {
    return null;
  }
};
