import { z } from "zod";

// Schema para el paso 1: Fechas y Transporte
export const solicitudPaso1Schema = z
  .object({
    fechaSalida: z.date({
      required_error: "La fecha de salida es requerida",
      invalid_type_error: "Debe seleccionar una fecha válida",
    }),
    fechaRetorno: z.date({
      required_error: "La fecha de retorno es requerida",
      invalid_type_error: "Debe seleccionar una fecha válida",
    }),
    transporteSalida: z
      .string({ required_error: "El transporte de salida es requerido" })
      .min(3, "Debe tener al menos 3 caracteres")
      .max(100, "Máximo 100 caracteres"),
    transporteRetorno: z
      .string({ required_error: "El transporte de retorno es requerido" })
      .min(3, "Debe tener al menos 3 caracteres")
      .max(100, "Máximo 100 caracteres"),
  })
  .refine((data) => data.fechaRetorno > data.fechaSalida, {
    message: "La fecha de retorno debe ser posterior a la fecha de salida",
    path: ["fechaRetorno"],
  });

// Schema para el paso 2: Objetivos
export const solicitudPaso2Schema = z.object({
  objetivos: z
    .array(
      z
        .string()
        .min(10, "Cada objetivo debe tener al menos 10 caracteres")
        .max(500, "Máximo 500 caracteres")
    )
    .min(2, "Debe agregar al menos 2 objetivos"),
});

// Schema para el paso 3: Criterios
export const solicitudPaso3Schema = z.object({
  criterios: z
    .array(
      z
        .string()
        .min(10, "Cada criterio debe tener al menos 10 caracteres")
        .max(500, "Máximo 500 caracteres")
    )
    .min(2, "Debe agregar al menos 2 criterios"),
});

// Schema para el paso 4: Participantes
export const solicitudPaso4Schema = z.object({
  deportistas: z
    .array(
      z.object({
        id: z.number(),
        nombre: z.string(),
        apellido: z.string(),
        cedula: z.string(),
      })
    )
    .min(1, "Debe seleccionar al menos un deportista"),
  entrenadores: z
    .array(
      z.object({
        id: z.number(),
        nombre: z.string(),
        apellido: z.string(),
        rol: z.string().optional(),
      })
    )
    .min(1, "Debe seleccionar al menos un entrenador"),
});

// Schema para el paso 5: Documento
export const solicitudPaso5Schema = z.object({
  documento: z
    .object({
      uri: z.string(),
      name: z.string(),
      size: z.number().optional(),
      mimeType: z.string().optional(),
    })
    .nullable()
    .refine((doc) => doc !== null, {
      message: "Debe seleccionar un documento",
    }),
  observaciones: z.string().max(1000, "Máximo 1000 caracteres").optional(),
});

// Schema completo de la solicitud
export const solicitudCompletaSchema = z.object({
  fechaSalida: z.date(),
  fechaRetorno: z.date(),
  transporteSalida: z.string(),
  transporteRetorno: z.string(),
  objetivos: z.array(z.string()),
  criterios: z.array(z.string()),
  deportistas: z.array(z.any()),
  entrenadores: z.array(z.any()),
  documento: z.any(),
  coleccionAvalId: z.number().optional(),
  observaciones: z.string().optional(),
});

export type SolicitudPaso1Data = z.infer<typeof solicitudPaso1Schema>;
export type SolicitudPaso2Data = z.infer<typeof solicitudPaso2Schema>;
export type SolicitudPaso3Data = z.infer<typeof solicitudPaso3Schema>;
export type SolicitudPaso4Data = z.infer<typeof solicitudPaso4Schema>;
export type SolicitudPaso5Data = z.infer<typeof solicitudPaso5Schema>;
export type SolicitudCompletaData = z.infer<typeof solicitudCompletaSchema>;
