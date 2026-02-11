import type { Categoria, Disciplina, PaginationMeta } from "@/core/eventos/interfaces/evento";

export interface Deportista {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  genero: string;
  fechaNacimiento: string;
  categoriaId: number;
  disciplinaId: number;
  afiliacion: boolean;
  categoria?: Categoria;
  disciplina?: Disciplina;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
}

export interface DeportistasPaginatedResponse {
  items: Deportista[];
  pagination: PaginationMeta;
}

export interface CreateDeportistaDto {
  nombres: string;
  apellidos: string;
  cedula: string;
  genero: string;
  fechaNacimiento: string;
  categoriaId: number;
  disciplinaId: number;
  afiliacion: boolean;
}

export interface UpdateDeportistaDto extends Partial<CreateDeportistaDto> {}
