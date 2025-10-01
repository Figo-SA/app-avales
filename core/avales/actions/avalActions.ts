import { Aval } from "../interfaces/aval";
import { avales } from "./dataAval";

export const getAvales = async (limit = 20, offset = 0): Promise<Aval[]> => {
  const paginatedAvales = avales.slice(offset, offset + limit);
  return new Promise((resolve) =>
    setTimeout(() => resolve(paginatedAvales), 500)
  );
};

export const getAvalById = async (id: string): Promise<Aval | null> => {
  const aval = avales.find((a) => a.id === id) || null;
  return new Promise((resolve) => setTimeout(() => resolve(aval), 500));
};
