import { Aval } from "../interfaces/aval";
import { avales } from "./dataAval";

export const getAvales = async (limit = 20, offset = 0): Promise<Aval[]> => {
  const paginatedAvales = avales.slice(offset, offset + limit);
  return new Promise((resolve) =>
    setTimeout(() => resolve(paginatedAvales), 500)
  );
};
