export interface Deportista {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  sexo: "M" | "F";
  fechaNacimiento: string;
  categoria: string;
}

export interface Aval {
  id: string;
  // Información del Evento (referencia)
  codigoItem: number;
  evento: string;
  tipoEvento: string;
  tipoParticipacion: string;
  deporte: string;
  provincia: string;
  alcance: string;
  fechaInicio: string;
  fechaFin: string;
  categoria: string;

  // Estado de la Solicitud/Aval
  status: "pending" | "sent" | "approved" | "rejected";

  // Deportistas y Entrenadores agregados
  deportistas: Deportista[];
  numeroDeportistasHombres: number;
  numeroDeportistasMujeres: number;
  numeroEntrenadoresHombres: number;
  numeroEntrenadoresMujeres: number;

  // Documento de solicitud
  documentoUrl?: string;
  documentoNombre?: string;

  // Fechas de control
  fechaSolicitud: Date;
  fechaAprobacion?: Date;
  fechaRechazo?: Date;
  motivoRechazo?: string;

  // Usuario que solicita
  usuarioId: string;
  usuarioNombre: string;
}

export type AvalStatus = "pending" | "sent" | "approved" | "rejected";
