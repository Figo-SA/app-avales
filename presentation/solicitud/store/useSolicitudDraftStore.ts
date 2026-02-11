import { logger } from "@/core/logger";
import { SecureStorageAdapter } from "@/helpers/adapters/secure-storage.adapter";
import { create } from "zustand";

const DRAFT_KEY_PREFIX = "solicitud-draft-";

export interface SolicitudDraft {
  step: number;
  coleccionAvalId?: number;
  fechaSalida?: string;
  fechaRetorno?: string;
  lugarSalida: string;
  lugarRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  objetivos: string[];
  criterios: string[];
  deportistas: any[];
  entrenadores: any[];
  observaciones: string;
}

interface SolicitudDraftState {
  saveDraft: (eventoId: string, data: SolicitudDraft) => Promise<void>;
  loadDraft: (eventoId: string) => Promise<SolicitudDraft | null>;
  clearDraft: (eventoId: string) => Promise<void>;
}

export const useSolicitudDraftStore = create<SolicitudDraftState>(() => ({
  saveDraft: async (eventoId: string, data: SolicitudDraft) => {
    try {
      const key = `${DRAFT_KEY_PREFIX}${eventoId}`;
      await SecureStorageAdapter.setItem(key, JSON.stringify(data));
    } catch (error) {
      logger.warn("Failed to save solicitud draft:", error);
    }
  },

  loadDraft: async (eventoId: string): Promise<SolicitudDraft | null> => {
    try {
      const key = `${DRAFT_KEY_PREFIX}${eventoId}`;
      const stored = await SecureStorageAdapter.getItem(key);
      if (stored) {
        return JSON.parse(stored) as SolicitudDraft;
      }
      return null;
    } catch (error) {
      logger.warn("Failed to load solicitud draft:", error);
      return null;
    }
  },

  clearDraft: async (eventoId: string) => {
    try {
      const key = `${DRAFT_KEY_PREFIX}${eventoId}`;
      await SecureStorageAdapter.removeItem(key);
    } catch (error) {
      logger.warn("Failed to clear solicitud draft:", error);
    }
  },
}));
