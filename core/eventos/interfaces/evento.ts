export type EventoEstado = "disponible" | "solicitado" | "rechazado" | "aceptado";

export interface Evento {
  codigoItem: number;
  tipoParticipacion: string;
  tipoEvento: string;
  evento: string;
  sexo: string;
  deporte: string;
  provincia: string;
  pais: string;
  alcance: string;
  fechaInicio: string;
  fechaFin: string;
  categoria: string;
  numeroEntrenadoresHombres: number;
  numeroEntrenadoresMujeres: number;
  numeroAtletasHombres: number;
  numeroAtletasMujeres: number;
  estado: EventoEstado; // Estado del evento para el usuario actual
  motivoRechazo?: string; // Solo presente cuando estado === "rechazado"
}

export interface EventoFilters {
  tipoEvento?: string;
  deporte?: string;
  provincia?: string;
  alcance?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface EventoListResponse {
  eventos: Evento[];
  total: number;
  page: number;
  limit: number;
}
