export type EventoEstado =
  | "disponible"
  | "solicitado"
  | "rechazado"
  | "aceptado";

export interface Disciplina {
  id: number;
  nombre: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface Evento {
  id: number;
  codigo: string;
  tipoParticipacion: string;
  tipoEvento: string;
  nombre: string;
  lugar: string;
  genero: string;
  disciplinaId: number;
  categoriaId: number;
  provincia: string;
  ciudad: string;
  pais: string;
  alcance: string;
  fechaInicio: string;
  fechaFin: string;
  numEntrenadoresHombres: number;
  numEntrenadoresMujeres: number;
  numAtletasHombres: number;
  numAtletasMujeres: number;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  disciplina: Disciplina;
  categoria: Categoria;
  // Campos locales/UI
  estado?: EventoEstado; // Estado del evento para el usuario actual
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

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  lastPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface EventosPaginatedResponse {
  items: Evento[];
  pagination: PaginationMeta;
}

export interface EventoListResponse {
  eventos: Evento[];
  total: number;
  page: number;
  limit: number;
}
