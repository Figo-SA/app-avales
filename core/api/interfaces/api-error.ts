/**
 * Interfaz para errores API según RFC 7807 (Problem Details)
 * https://datatracker.ietf.org/doc/html/rfc7807
 */
export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  requestId?: string;
  apiVersion?: string;
  field?: string;
  errorCode?: string;
  timestamp?: string;
}

/**
 * Códigos de error comunes de la API
 */
export enum ErrorCode {
  // Errores de autenticación
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",

  // Errores de validación
  VALIDATION_ERROR = "VALIDATION_ERROR",
  DUPLICATE_CEDULA = "DUPLICATE_CEDULA",
  DUPLICATE_EMAIL = "DUPLICATE_EMAIL",
  INVALID_CEDULA = "INVALID_CEDULA",

  // Errores de recursos
  NOT_FOUND = "NOT_FOUND",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",

  // Errores del servidor
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",

  // Errores de negocio
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  OPERATION_NOT_ALLOWED = "OPERATION_NOT_ALLOWED",

  // Errores de recuperación de contraseña
  USER_NOT_FOUND = "USER_NOT_FOUND",
  INVALID_CODE = "INVALID_CODE",
  CODE_EXPIRED = "CODE_EXPIRED",
  CODE_ALREADY_USED = "CODE_ALREADY_USED",
  TOO_MANY_ATTEMPTS = "TOO_MANY_ATTEMPTS",
}

/**
 * Mensajes de error amigables por código
 * Facilita la internacionalización futura
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Autenticación
  INVALID_CREDENTIALS: "Usuario o contraseña incorrectos",
  TOKEN_EXPIRED: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente",
  UNAUTHORIZED: "No tienes permisos para realizar esta acción",

  // Validación
  VALIDATION_ERROR: "Por favor, verifica los datos ingresados",
  DUPLICATE_CEDULA: "La cédula ya está registrada en el sistema",
  DUPLICATE_EMAIL: "El correo electrónico ya está registrado",
  INVALID_CEDULA: "La cédula ingresada no es válida",

  // Recursos
  NOT_FOUND: "El recurso solicitado no fue encontrado",
  RESOURCE_NOT_FOUND: "No se encontró el elemento solicitado",

  // Servidor
  INTERNAL_SERVER_ERROR: "Ocurrió un error en el servidor. Intenta nuevamente",
  SERVICE_UNAVAILABLE: "El servicio no está disponible. Intenta más tarde",

  // Negocio
  INSUFFICIENT_PERMISSIONS: "No tienes los permisos necesarios",
  OPERATION_NOT_ALLOWED: "Esta operación no está permitida",

  // Recuperación de contraseña
  USER_NOT_FOUND: "No existe una cuenta con este correo electrónico",
  INVALID_CODE: "El código ingresado es incorrecto",
  CODE_EXPIRED: "El código ha expirado. Solicita uno nuevo",
  CODE_ALREADY_USED: "Este código ya fue utilizado. Solicita uno nuevo",
  TOO_MANY_ATTEMPTS: "Demasiados intentos. Espera unos minutos e intenta nuevamente",

  // Mensaje por defecto
  DEFAULT: "Ocurrió un error inesperado. Por favor, intenta nuevamente",
};
