// validations/avalSchemas.ts
import { z } from "zod";

export const coleccionAvalSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  disciplina: z.string().min(1, "Selecciona una disciplina"),
  categoria: z.string().min(1, "Selecciona una categoría"),
  genero: z.string().min(1, "Selecciona un género"),
  nombreEvento: z.string().min(1, "El nombre del evento es obligatorio"),
  lugar: z.string().min(1, "El lugar es obligatorio"),
});

export const avalTecnicoSchema = z
  .object({
    fechaSalida: z
      .date()
      .refine(
        (date) => date > new Date(),
        "La fecha de salida debe ser futura"
      ),
    horaSalida: z.string().min(1, "La hora de salida es obligatoria"),
    fechaRetorno: z.date(),
    horaRetorno: z.string().min(1, "La hora de retorno es obligatoria"),
    transporteSalida: z
      .string()
      .min(1, "El transporte de salida es obligatorio"),
    transporteRetorno: z
      .string()
      .min(1, "El transporte de retorno es obligatorio"),
    numeroOficiales: z.number().min(1, "Debe haber al menos 1 oficial"),
    numeroAtletas: z.number().min(1, "Debe haber al menos 1 atleta"),
  })
  .refine((data) => data.fechaRetorno > data.fechaSalida, {
    message: "La fecha de retorno debe ser posterior a la de salida",
    path: ["fechaRetorno"],
  });
