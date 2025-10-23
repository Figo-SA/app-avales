import { API_ENDPOINTS } from "@/core/api";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import { logger } from "@/core/logger";
import {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ValidateCodeRequest,
  ValidateCodeResponse,
} from "../interface/password-recovery";

/**
 * Solicita un código de recuperación de contraseña
 * Se envía un código de 6 dígitos al email proporcionado
 */
export const forgotPassword = async (
  email: string
): Promise<ForgotPasswordResponse> => {
  try {
    const { data } = await httpClient.post<ForgotPasswordResponse>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email: email.toLowerCase().trim() } as ForgotPasswordRequest
    );

    logger.info("Password recovery code sent", { email });
    return data;
  } catch (error) {
    const errorMessage = handleApiError(error, "forgotPassword");
    throw new Error(errorMessage);
  }
};

/**
 * Valida el código de recuperación de 6 dígitos
 */
export const validateRecoveryCode = async (
  email: string,
  code: string
): Promise<ValidateCodeResponse> => {
  try {
    const { data } = await httpClient.post<ValidateCodeResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      {
        email: email.toLowerCase().trim(),
        code: code.trim(),
        validate: true, // Flag para solo validar sin resetear
      } as ValidateCodeRequest & { validate: boolean }
    );

    logger.info("Recovery code validated", { email });
    return data;
  } catch (error) {
    const errorMessage = handleApiError(error, "validateRecoveryCode");
    throw new Error(errorMessage);
  }
};

/**
 * Resetea la contraseña con el código validado
 */
export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  try {
    const { data } = await httpClient.post<ResetPasswordResponse>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      {
        email: email.toLowerCase().trim(),
        code: code.trim(),
        newPassword,
      } as ResetPasswordRequest
    );

    logger.info("Password reset successful", { email });
    return data;
  } catch (error) {
    const errorMessage = handleApiError(error, "resetPassword");
    throw new Error(errorMessage);
  }
};
