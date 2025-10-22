import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";
import { WrapperResponse } from "@/types/api.types";
import axios from "axios";
import { logger } from "../logger";
import { API_CONFIG } from "./api.config";

export const httpClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

// Interceptor de request: agrega token automáticamente
httpClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStorageAdapter.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response: desempaqueta WrapperResponse automáticamente
httpClient.interceptors.response.use(
  (response) => {
    // Si la respuesta tiene el formato WrapperResponse, extraer solo el data
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const wrappedData = response.data as WrapperResponse<any>;
      
      // Log opcional de metadata para debugging
      logger.debug("API Response Meta:", {
        status: wrappedData.status,
        requestId: wrappedData.meta?.requestId,
        duration: wrappedData.meta?.durationMs,
      });
      
      // Retornar solo el data desempaquetado
      response.data = wrappedData.data;
    }
    
    return response;
  },
  (err) => {
    logger.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);
