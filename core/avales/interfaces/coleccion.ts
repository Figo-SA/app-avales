import { Evento } from "@/core/eventos/interfaces/evento";

export interface ColeccionAval {
  id: number;
  descripcion: string;
  eventoId: number;
  dtmUrl: string;
  pdaUrl: string;
  solicitudUrl: string;
  createdAt: string;
  updatedAt: string;
  evento: Evento;
  avalTecnico: AvalTecnico;
  pda: any[];
  dtm: any[];
  entrenadores: EntrenadorColeccion[];
  financiero: any[];
  aval?: string;
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

export interface ColeccionResponse {
  status: string;
  message: string;
  meta: {
    requestId: string;
    timestamp: string;
    apiVersion: string;
    durationMs: number;
    page: number;
    limit: number;
    total: number;
  };
  data: ColeccionAval[];
}
