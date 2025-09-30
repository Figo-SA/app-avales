import { logger } from "@/core/logger";
import { Evento, EventoListResponse, EventoFilters, EventoToAvalMapping } from "@/types/EventoTypes";
import { getEventosMock, getEventoByIdMock } from "@/data/eventos-mock";

export const getEventos = async (filters?: EventoFilters): Promise<EventoListResponse> => {
  try {
    logger.info("Fetching eventos with filters", filters);
    const { eventos, total } = await getEventosMock(filters);
    
    const response: EventoListResponse = {
      eventos,
      total,
      page: 1,
      limit: 20
    };
    
    logger.info("Eventos fetched successfully", { count: eventos.length });
    return response;
  } catch (error: any) {
    logger.error("Error fetching eventos", error);
    throw new Error("Error al cargar los eventos. Intenta nuevamente.");
  }
};

export const getEventoById = async (id: number): Promise<Evento> => {
  try {
    logger.info("Fetching evento by id", { id });
    const evento = await getEventoByIdMock(id);
    
    if (!evento) {
      throw new Error("Evento no encontrado");
    }
    
    logger.info("Evento fetched successfully", { id, nombre: evento.nombre });
    return evento;
  } catch (error: any) {
    logger.error("Error fetching evento", error);
    throw new Error("Error al cargar el evento. Intenta nuevamente.");
  }
};

// Funciones CRUD no implementadas para mock
export const createEvento = async (evento: Omit<Evento, 'id' | 'createdAt' | 'updatedAt'>): Promise<Evento> => {
  throw new Error("Crear eventos no está disponible en modo mock");
};

export const updateEvento = async (id: number, evento: Partial<Evento>): Promise<Evento> => {
  throw new Error("Actualizar eventos no está disponible en modo mock");
};

export const deleteEvento = async (id: number): Promise<void> => {
  throw new Error("Eliminar eventos no está disponible en modo mock");
};

// Función para mapear evento a datos de aval
export const mapEventoToAval = (evento: Evento): EventoToAvalMapping => {
  return {
    eventoId: evento.id,
    coleccionAval: {
      nombreEvento: evento.nombre,
      disciplina: evento.disciplina,
      categoria: evento.categoria,
      genero: evento.genero,
      lugar: evento.lugar,
      descripcion: evento.descripcion || `Aval para el evento ${evento.nombre}`,
    },
    avalTecnico: {
      fechaSalida: new Date(evento.fechaInicio),
      fechaRetorno: new Date(evento.fechaFin),
      numeroOficiales: evento.numeroOficiales || 0,
      numeroAtletas: evento.numeroParticipantes || 0,
    },
  };
};
