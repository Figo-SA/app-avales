import { z } from 'zod';

export const eventoSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  disciplina: z.string()
    .min(2, 'La disciplina es requerida'),
  
  categoria: z.string()
    .min(2, 'La categoría es requerida'),
  
  genero: z.enum(['Masculino', 'Femenino', 'Mixto'], {
    errorMap: () => ({ message: 'Selecciona un género válido' })
  }),
  
  lugar: z.string()
    .min(3, 'El lugar debe tener al menos 3 caracteres')
    .max(200, 'El lugar no puede exceder 200 caracteres'),
  
  fechaInicio: z.string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Fecha de inicio inválida'
    }),
  
  fechaFin: z.string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Fecha de fin inválida'
    }),
  
  horaInicio: z.string().optional(),
  horaFin: z.string().optional(),
  
  descripcion: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional(),
  
  numeroParticipantes: z.number()
    .min(1, 'Debe haber al menos 1 participante')
    .max(10000, 'Número de participantes muy alto')
    .optional(),
  
  numeroOficiales: z.number()
    .min(0, 'El número de oficiales no puede ser negativo')
    .max(100, 'Número de oficiales muy alto')
    .optional(),
  
  estado: z.enum(['programado', 'en_curso', 'finalizado', 'cancelado'], {
    errorMap: () => ({ message: 'Estado inválido' })
  }),
  
  organizador: z.string()
    .max(100, 'El organizador no puede exceder 100 caracteres')
    .optional(),
  
  contacto: z.string()
    .max(100, 'El contacto no puede exceder 100 caracteres')
    .optional(),
  
  telefono: z.string()
    .regex(/^[\d\s\-\+\(\)]+$/, 'Formato de teléfono inválido')
    .optional(),
  
  email: z.string()
    .email('Email inválido')
    .optional(),
  
  observaciones: z.string()
    .max(1000, 'Las observaciones no pueden exceder 1000 caracteres')
    .optional(),
}).refine((data) => {
  const fechaInicio = new Date(data.fechaInicio);
  const fechaFin = new Date(data.fechaFin);
  return fechaFin >= fechaInicio;
}, {
  message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio',
  path: ['fechaFin']
});

export const eventoFiltersSchema = z.object({
  disciplina: z.string().optional(),
  categoria: z.string().optional(),
  genero: z.string().optional(),
  estado: z.string().optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const adminEventoSchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  tipoEvento: z.string().min(1, 'El tipo de evento es requerido'),
  tipoParticipacion: z.string().min(1, 'El tipo de participación es requerido'),
  genero: z.string().min(1, 'Selecciona un género'),
  disciplinaId: z.number({ required_error: 'Selecciona una disciplina' }).min(1, 'Selecciona una disciplina'),
  categoriaId: z.number({ required_error: 'Selecciona una categoría' }).min(1, 'Selecciona una categoría'),
  alcance: z.string().min(1, 'El alcance es requerido'),
  lugar: z.string()
    .min(3, 'El lugar debe tener al menos 3 caracteres')
    .max(200, 'El lugar no puede exceder 200 caracteres'),
  provincia: z.string().min(1, 'La provincia es requerida'),
  ciudad: z.string().min(1, 'La ciudad es requerida'),
  pais: z.string().min(1, 'El país es requerido'),
  fechaInicio: z.date({ required_error: 'La fecha de inicio es requerida' }),
  fechaFin: z.date({ required_error: 'La fecha de fin es requerida' }),
  numEntrenadoresHombres: z.number().min(0, 'No puede ser negativo'),
  numEntrenadoresMujeres: z.number().min(0, 'No puede ser negativo'),
  numAtletasHombres: z.number().min(0, 'No puede ser negativo'),
  numAtletasMujeres: z.number().min(0, 'No puede ser negativo'),
}).refine((data) => data.fechaFin >= data.fechaInicio, {
  message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio',
  path: ['fechaFin'],
});

export type EventoFormData = z.infer<typeof eventoSchema>;
export type EventoFiltersData = z.infer<typeof eventoFiltersSchema>;
export type AdminEventoFormData = z.infer<typeof adminEventoSchema>;
