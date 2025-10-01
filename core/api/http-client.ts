import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";
import axios from "axios";
import { logger } from "../logger";
import { API_CONFIG } from "./api.config";

export const httpClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

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

httpClient.interceptors.response.use(
  (res) => res,
  (err) => {
    logger.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);
