import { API_ENDPOINTS } from "@/core/api/api.config";
import { httpClient } from "@/core/api/http-client";
import { handleApiError } from "@/helpers/error-handler";
import {
  AllStatistics,
  AvalesPorEstado,
  AvalesPorEtapa,
  AvalesTimeline,
  DashboardStats,
  DistribucionPorCategoria,
  DistribucionPorDisciplina,
  StatisticsQuery,
} from "../interfaces/statistics.interface";

/**
 * Obtiene todas las estadísticas en una sola llamada
 * Ideal para la carga inicial del dashboard
 */
export const getAllStatistics = async (
  query?: StatisticsQuery
): Promise<AllStatistics> => {
  try {
    const response = await httpClient.get<AllStatistics>(
      API_ENDPOINTS.STATISTICS.ALL,
      { params: query }
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getAllStatistics");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene estadísticas generales del dashboard
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await httpClient.get<DashboardStats>(
      API_ENDPOINTS.STATISTICS.DASHBOARD
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getDashboardStats");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene la distribución de avales por estado
 */
export const getAvalesPorEstado = async (
  query?: StatisticsQuery
): Promise<AvalesPorEstado> => {
  try {
    const response = await httpClient.get<AvalesPorEstado>(
      API_ENDPOINTS.STATISTICS.AVALES_POR_ESTADO,
      { params: query }
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getAvalesPorEstado");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene la distribución de avales por etapa del flujo
 */
export const getAvalesPorEtapa = async (
  query?: StatisticsQuery
): Promise<AvalesPorEtapa> => {
  try {
    const response = await httpClient.get<AvalesPorEtapa>(
      API_ENDPOINTS.STATISTICS.AVALES_POR_ETAPA,
      { params: query }
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getAvalesPorEtapa");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene el timeline de avales por mes
 */
export const getAvalesTimeline = async (
  meses: number = 12
): Promise<AvalesTimeline> => {
  try {
    const response = await httpClient.get<AvalesTimeline>(
      API_ENDPOINTS.STATISTICS.AVALES_TIMELINE,
      { params: { meses } }
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getAvalesTimeline");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene la distribución de avales por disciplina
 */
export const getAvalesPorDisciplina = async (
  query?: StatisticsQuery
): Promise<DistribucionPorDisciplina> => {
  try {
    const response = await httpClient.get<DistribucionPorDisciplina>(
      API_ENDPOINTS.STATISTICS.AVALES_POR_DISCIPLINA,
      { params: query }
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getAvalesPorDisciplina");
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene la distribución de avales por categoría
 */
export const getAvalesPorCategoria = async (
  query?: StatisticsQuery
): Promise<DistribucionPorCategoria> => {
  try {
    const response = await httpClient.get<DistribucionPorCategoria>(
      API_ENDPOINTS.STATISTICS.AVALES_POR_CATEGORIA,
      { params: query }
    );
    return response.data;
  } catch (error) {
    const errorMessage = handleApiError(error, "getAvalesPorCategoria");
    throw new Error(errorMessage);
  }
};
