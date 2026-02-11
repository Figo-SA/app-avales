import type { Estado, EtapaFlujo } from "@/core/constants/avales.constants";
import { Evento } from "@/core/eventos/interfaces/evento";

export interface ColeccionAval {
  id: number;
  descripcion: string;
  eventoId: number;
  convocatoriaUrl?: string | null;
  certificadoMedicoUrl?: string | null;
  dtmUrl?: string | null;
  pdaUrl?: string | null;
  solicitudUrl?: string | null;
  aval?: string | null;
  estado: Estado;
  etapaActual?: EtapaFlujo;
  etapa?: EtapaFlujo;
  comentario?: string | null;
  createdAt: string;
  updatedAt: string;
  evento: Evento;
  avalTecnico?: AvalTecnico;
  pda: any[];
  dtm: any[];
  entrenadores: EntrenadorColeccion[];
  financiero: any[];
}

export interface AvalTecnico {
  id: number;
  coleccionAvalId: number;
  descripcion: string;
  archivo: string;
  fechaHoraSalida: string;
  fechaHoraRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  entrenadores: number;
  atletas: number;
  observaciones: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  objetivos: Objetivo[];
  criterios: Criterio[];
  requerimientos: Requerimiento[];
  deportistasAval: DeportistaAval[];
}

export interface Objetivo {
  id: number;
  avalTecnicoId: number;
  orden: number;
  descripcion: string;
}

export interface Criterio {
  id: number;
  avalTecnicoId: number;
  orden: number;
  descripcion: string;
}

export interface Requerimiento {
  id: number;
  avalTecnicoId: number;
  rubroId: number;
  cantidadDias: string;
  valorUnitario: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeportistaAval {
  id: number;
  avalTecnicoId: number;
  deportistaId: number;
  rol: string;
  deportista: Deportista;
}

export interface Deportista {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  categoriaId: number;
  disciplinaId: number;
  afiliacion: boolean;
  genero: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface EntrenadorColeccion {
  id: number;
  coleccionAvalId: number;
  entrenadorId: number;
  rol: string;
  esPrincipal: boolean;
  entrenador: Entrenador;
}

export interface Entrenador {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  categoriaId: number;
  disciplinaId: number;
  afiliacion: boolean;
  genero: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface ColeccionCounts {
  all: number;
  solicitado: number;
  aceptado: number;
  rechazado: number;
}

export interface ColeccionMeta {
  requestId: string;
  timestamp: string;
  apiVersion: string;
  durationMs: number;
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  counts?: ColeccionCounts;
}

export interface ColeccionResponse {
  status: string;
  message: string;
  meta: ColeccionMeta;
  data: ColeccionAval[];
}
