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
