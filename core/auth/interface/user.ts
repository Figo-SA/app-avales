import type { PaginationMeta } from "@/core/eventos/interfaces/evento";

export interface User {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  cedula?: string;
  roles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersPaginatedResponse {
  items: User[];
  pagination: PaginationMeta;
}

export interface CreateUserDto {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  cedula?: string;
  roles: string[];
}

export interface UpdateUserDto {
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  cedula?: string;
  roles?: string[];
}
