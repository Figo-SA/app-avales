import { Evento } from "../interfaces/evento";
import { eventos } from "./dataEvento";

export const getEventos = async (limit = 20, offset = 0): Promise<Evento[]> => {
  const paginatedEventos = eventos.slice(offset, offset + limit);
  return new Promise<Evento[]>((resolve) => {
    setTimeout(() => resolve(paginatedEventos), 500);
  });
};

export const getEventoById = async (id: number): Promise<Evento | null> => {
  const evento = eventos.find((e) => e.codigoItem === id) || null;
  return new Promise<Evento | null>((resolve) => {
    setTimeout(() => resolve(evento), 500);
  });
};
