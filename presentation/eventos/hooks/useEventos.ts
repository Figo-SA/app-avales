import { useCallback, useMemo } from 'react';
import { useEventosStore } from '../store/useEventosStore';
import { EventoFilters, Evento } from '@/types/EventoTypes';
import { logger } from '@/core/logger';

export const useEventos = () => {
  const {
    eventos,
    eventoSeleccionado,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    totalEventos,
    fetchEventos,
    fetchEventoById,
    createNewEvento,
    updateExistingEvento,
    deleteExistingEvento,
    setFilters,
    clearFilters,
    setEventoSeleccionado,
    clearError,
  } = useEventosStore();

  // Memoizar eventos filtrados para mejor performance
  const eventosFiltrados = useMemo(() => {
    if (!filters.search) return eventos;
    
    const searchTerm = filters.search.toLowerCase();
    return eventos.filter(evento => 
      evento.nombre.toLowerCase().includes(searchTerm) ||
      evento.disciplina.toLowerCase().includes(searchTerm) ||
      evento.lugar.toLowerCase().includes(searchTerm) ||
      evento.categoria.toLowerCase().includes(searchTerm)
    );
  }, [eventos, filters.search]);

  // Función para buscar eventos con debounce implícito
  const buscarEventos = useCallback(async (searchTerm: string) => {
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    await fetchEventos(newFilters);
  }, [filters, setFilters, fetchEventos]);

  // Función para aplicar filtros
  const aplicarFiltros = useCallback(async (newFilters: EventoFilters) => {
    setFilters(newFilters);
    await fetchEventos(newFilters, 1); // Resetear a página 1
  }, [setFilters, fetchEventos]);

  // Función para cargar más eventos (paginación)
  const cargarMasEventos = useCallback(async () => {
    if (currentPage < totalPages && !loading) {
      await fetchEventos(filters, currentPage + 1);
    }
  }, [currentPage, totalPages, loading, filters, fetchEventos]);

  // Función para refrescar eventos
  const refrescarEventos = useCallback(async () => {
    await fetchEventos(filters, 1);
  }, [filters, fetchEventos]);

  // Función para seleccionar evento y navegar a crear aval
  const seleccionarEventoParaAval = useCallback((evento: Evento) => {
    setEventoSeleccionado(evento);
    logger.info('Evento seleccionado para crear aval', { eventoId: evento.id, nombre: evento.nombre });
  }, [setEventoSeleccionado]);

  // Función para crear evento
  const crearEvento = useCallback(async (eventoData: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const nuevoEvento = await createNewEvento(eventoData);
      logger.info('Evento creado exitosamente', { eventoId: nuevoEvento.id });
      return nuevoEvento;
    } catch (error) {
      logger.error('Error creando evento', error);
      throw error;
    }
  }, [createNewEvento]);

  // Función para actualizar evento
  const actualizarEvento = useCallback(async (id: number, eventoData: Partial<Evento>) => {
    try {
      await updateExistingEvento(id, eventoData);
      logger.info('Evento actualizado exitosamente', { eventoId: id });
    } catch (error) {
      logger.error('Error actualizando evento', error);
      throw error;
    }
  }, [updateExistingEvento]);

  // Función para eliminar evento
  const eliminarEvento = useCallback(async (id: number) => {
    try {
      await deleteExistingEvento(id);
      logger.info('Evento eliminado exitosamente', { eventoId: id });
    } catch (error) {
      logger.error('Error eliminando evento', error);
      throw error;
    }
  }, [deleteExistingEvento]);

  // Estadísticas de eventos
  const estadisticas = useMemo(() => {
    const programados = eventos.filter(e => e.estado === 'programado').length;
    const enCurso = eventos.filter(e => e.estado === 'en_curso').length;
    const finalizados = eventos.filter(e => e.estado === 'finalizado').length;
    const cancelados = eventos.filter(e => e.estado === 'cancelado').length;

    return {
      total: eventos.length,
      programados,
      enCurso,
      finalizados,
      cancelados,
    };
  }, [eventos]);

  return {
    // Estado
    eventos: eventosFiltrados,
    eventoSeleccionado,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    totalEventos,
    estadisticas,
    
    // Acciones
    fetchEventos,
    fetchEventoById,
    buscarEventos,
    aplicarFiltros,
    cargarMasEventos,
    refrescarEventos,
    seleccionarEventoParaAval,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
    clearFilters,
    clearError,
  };
};
