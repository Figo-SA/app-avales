import type { EtapaFlujo } from "@/core/constants/avales.constants";

export type EventoEstado = "DISPONIBLE" | "SOLICITADO" | "RECHAZADO" | "ACEPTADO";

export interface ItemPresupuestario {
  id: number;
  nombre: string;
  numero: number;
}

export interface PresupuestoEvent {
  id: number;
  mes: number;
  presupuesto: string;
  item: ItemPresupuestario;
}

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
  presupuesto?: PresupuestoEvent[];
  // Campos locales/UI
  estado?: EventoEstado; // Estado del evento para el usuario actual
  etapa?: EtapaFlujo; // Etapa actual del proceso (e.g., "REVISION_DTM", "COMPRAS_PUBLICAS")
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
  counts?: {
    disponibles: number;
    solicitados: number;
    rechazados: number;
    aceptados: number;
  };
}

export interface EventoListResponse {
  eventos: Evento[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateEventoDto {
  nombre: string;
  tipoEvento: string;
  tipoParticipacion: string;
  genero: string;
  disciplinaId: number;
  categoriaId: number;
  alcance: string;
  lugar: string;
  provincia: string;
  ciudad: string;
  pais: string;
  fechaInicio: string;
  fechaFin: string;
  numEntrenadoresHombres: number;
  numEntrenadoresMujeres: number;
  numAtletasHombres: number;
  numAtletasMujeres: number;
}

export interface UpdateEventoDto extends Partial<CreateEventoDto> {}
