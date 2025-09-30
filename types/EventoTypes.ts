export interface Evento {
  id: number;
  nombre: string;
  disciplina: string;
  categoria: string;
  genero: string;
  lugar: string;
  fechaInicio: string;
  fechaFin: string;
  horaInicio?: string;
  horaFin?: string;
  descripcion?: string;
  numeroParticipantes?: number;
  numeroOficiales?: number;
  estado: 'programado' | 'en_curso' | 'finalizado' | 'cancelado';
  organizador?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventoListResponse {
  eventos: Evento[];
  total: number;
  page: number;
  limit: number;
}

export interface EventoFilters {
  disciplina?: string;
  categoria?: string;
  genero?: string;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  search?: string;
  page?: string;
  limit?: string;
}

// Interface para mapear evento a datos de aval
export interface EventoToAvalMapping {
  eventoId: number;
  coleccionAval: {
    nombreEvento: string;
    disciplina: string;
    categoria: string;
    genero: string;
    lugar: string;
    descripcion: string;
  };
  avalTecnico: {
    fechaSalida: Date;
    fechaRetorno: Date;
    numeroOficiales: number;
    numeroAtletas: number;
  };
}
