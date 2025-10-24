import { z } from "zod";

/**
 * Schema para solicitar código de recuperación
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido")
    .toLowerCase()
    .trim(),
});

/**
 * Schema para validar código de 6 dígitos
 */
export const validateCodeSchema = z.object({
  code: z
    .string()
    .min(1, "Ingresa el código")
    .length(6, "El código debe tener 6 dígitos")
    .regex(/^\d+$/, "El código debe contener solo números"),
});

/**
 * Schema para resetear contraseña
 */
export const resetPasswordSchema = z
  .object({
    code: z
      .string()
      .min(1, "Ingresa el código")
      .length(6, "El código debe tener 6 dígitos")
      .regex(/^\d+$/, "El código debe contener solo números"),
    newPassword: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(50, "La contraseña no puede exceder 50 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Debe contener mayúsculas, minúsculas y números"
      ),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Tipos TypeScript generados de los schemas
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ValidateCodeFormData = z.infer<typeof validateCodeSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
