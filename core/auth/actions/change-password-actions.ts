import { API_ENDPOINTS } from "@/core/api";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import { logger } from "@/core/logger";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from "../interface/change-password";

/**
 * Cambia la contraseña del usuario autenticado
 * Requiere la contraseña actual para verificar identidad
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResponse> => {
  try {
    const { data } = await httpClient.post<ChangePasswordResponse>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      {
        currentPassword,
        newPassword,
      } as ChangePasswordRequest
    );

    logger.info("Password changed successfully");
    return data;
  } catch (error) {
    const errorMessage = handleApiError(error, "changePassword");
    throw new Error(errorMessage);
  }
};
