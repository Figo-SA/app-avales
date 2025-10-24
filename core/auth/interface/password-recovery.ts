/**
 * Interfaces para recuperación de contraseña
 */

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  email: string;
}

export interface ValidateCodeRequest {
  email: string;
  code: string;
}

export interface ValidateCodeResponse {
  valid: boolean;
  message: string;
  resetToken?: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}
