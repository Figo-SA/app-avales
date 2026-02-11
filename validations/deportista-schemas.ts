import { z } from "zod";

export const deportistaSchema = z.object({
  nombres: z
    .string()
    .min(2, "Los nombres deben tener al menos 2 caracteres")
    .max(100, "Los nombres no pueden exceder 100 caracteres"),
  apellidos: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(100, "Los apellidos no pueden exceder 100 caracteres"),
  cedula: z
    .string()
    .min(5, "La cédula debe tener al menos 5 caracteres")
    .max(20, "La cédula no puede exceder 20 caracteres"),
  genero: z.string().min(1, "Selecciona un género"),
  fechaNacimiento: z.date({
    required_error: "La fecha de nacimiento es requerida",
    invalid_type_error: "Fecha inválida",
  }),
  categoriaId: z.number({ required_error: "Selecciona una categoría" }).min(1, "Selecciona una categoría"),
  disciplinaId: z.number({ required_error: "Selecciona una disciplina" }).min(1, "Selecciona una disciplina"),
  afiliacion: z.boolean(),
});

export type DeportistaFormData = z.infer<typeof deportistaSchema>;
