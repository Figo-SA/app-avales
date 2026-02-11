import { z } from "zod";

export const createUserSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  apellido: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres"),
  cedula: z
    .string()
    .min(5, "La cédula debe tener al menos 5 caracteres")
    .max(20, "La cédula no puede exceder 20 caracteres")
    .optional()
    .or(z.literal("")),
  roles: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un rol"),
});

export const updateUserSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  apellido: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(50, "La contraseña no puede exceder 50 caracteres")
    .optional()
    .or(z.literal("")),
  cedula: z
    .string()
    .min(5, "La cédula debe tener al menos 5 caracteres")
    .max(20, "La cédula no puede exceder 20 caracteres")
    .optional()
    .or(z.literal("")),
  roles: z
    .array(z.string())
    .min(1, "Debe seleccionar al menos un rol"),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
