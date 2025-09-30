import { create } from 'zustand';
import { Evento, EventoFilters } from '@/types/EventoTypes';
import { getEventos, getEventoById, createEvento, updateEvento, deleteEvento } from '@/core/eventos/actions/eventos-actions';
import { logger } from '@/core/logger';

interface EventosState {
  // Estado
  eventos: Evento[];
  eventoSeleccionado: Evento | null;
  loading: boolean;
  error: string | null;
  filters: EventoFilters;
  
  // Paginación
  currentPage: number;
  totalPages: number;
  totalEventos: number;
  
  // Acciones
  fetchEventos: (filters?: EventoFilters, page?: number) => Promise<void>;
  fetchEventoById: (id: number) => Promise<void>;
  createNewEvento: (evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Evento>;
  updateExistingEvento: (id: number, evento: Partial<Evento>) => Promise<void>;
  deleteExistingEvento: (id: number) => Promise<void>;
  setFilters: (filters: EventoFilters) => void;
  clearFilters: () => void;
  setEventoSeleccionado: (evento: Evento | null) => void;
  clearError: () => void;
}

export const useEventosStore = create<EventosState>((set, get) => ({
  // Estado inicial
  eventos: [],
  eventoSeleccionado: null,
  loading: false,
  error: null,
  filters: {},
  currentPage: 1,
  totalPages: 1,
  totalEventos: 0,

  // Acciones
  fetchEventos: async (filters?: EventoFilters, page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await getEventos({ ...filters, page: page.toString(), limit: '20' });
      set({
        eventos: response.eventos,
        currentPage: page,
        totalPages: Math.ceil(response.total / 20),
        totalEventos: response.total,
        loading: false,
        filters: filters || {},
      });
    } catch (error: any) {
      logger.error('Error in fetchEventos', error);
      set({ 
        error: error.message || 'Error al cargar eventos',
        loading: false 
      });
    }
  },

  fetchEventoById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const evento = await getEventoById(id);
      set({
        eventoSeleccionado: evento,
        loading: false,
      });
    } catch (error: any) {
      logger.error('Error in fetchEventoById', error);
      set({ 
        error: error.message || 'Error al cargar evento',
        loading: false 
      });
    }
  },

  createNewEvento: async (eventoData) => {
    set({ loading: true, error: null });
    try {
      const nuevoEvento = await createEvento(eventoData);
      const { eventos } = get();
      set({
        eventos: [nuevoEvento, ...eventos],
        loading: false,
      });
      return nuevoEvento;
    } catch (error: any) {
      logger.error('Error in createNewEvento', error);
      set({ 
        error: error.message || 'Error al crear evento',
        loading: false 
      });
      throw error;
    }
  },

  updateExistingEvento: async (id: number, eventoData) => {
    set({ loading: true, error: null });
    try {
      const eventoActualizado = await updateEvento(id, eventoData);
      const { eventos } = get();
      set({
        eventos: eventos.map(evento => 
          evento.id === id ? eventoActualizado : evento
        ),
        eventoSeleccionado: eventoActualizado,
        loading: false,
      });
    } catch (error: any) {
      logger.error('Error in updateExistingEvento', error);
      set({ 
        error: error.message || 'Error al actualizar evento',
        loading: false 
      });
      throw error;
    }
  },

  deleteExistingEvento: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await deleteEvento(id);
      const { eventos } = get();
      set({
        eventos: eventos.filter(evento => evento.id !== id),
        eventoSeleccionado: null,
        loading: false,
      });
    } catch (error: any) {
      logger.error('Error in deleteExistingEvento', error);
      set({ 
        error: error.message || 'Error al eliminar evento',
        loading: false 
      });
      throw error;
    }
  },

  setFilters: (filters: EventoFilters) => {
    set({ filters });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  setEventoSeleccionado: (evento: Evento | null) => {
    set({ eventoSeleccionado: evento });
  },

  clearError: () => {
    set({ error: null });
  },
}));
