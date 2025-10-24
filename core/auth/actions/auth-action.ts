import { API_ENDPOINTS } from "@/core/api";
import { httpClient } from "@/core/api/http-client";
import { User } from "@/core/auth/interface/user";
import { handleApiError } from "@/helpers/error-handler";
import { logger } from "@/core/logger";
import { toast } from "@backpackapp-io/react-native-toast";

export interface AuthResponse {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula?: string;
  roles: string[];
  token: string;
  createdAt?: string;
  updatedAt?: string;
}

// Función helper para separar user y token
const returnUserToken = (
  authData: AuthResponse
): { user: User; token: string } => {
  const { token, ...user } = authData;
  return { user, token };
};

export const authLogin = async (email: string, password: string) => {
  email = email.trim().toLowerCase();
  try {
    const { data } = await httpClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        email,
        password,
      }
    );
    logger.info("Login successful", data);

    return returnUserToken(data);
  } catch (error: any) {
    const errorMessage = handleApiError(error, "authLogin");
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await httpClient.get<AuthResponse>(
      API_ENDPOINTS.AUTH.CHECK_STATUS
    );
    logger.info("Check status successful", data);
    return returnUserToken(data);
  } catch (error: any) {
    logger.info("Check status failed - user not authenticated");
    return null;
  }
};
