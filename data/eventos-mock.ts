import { Evento } from '@/types/EventoTypes';

export const EVENTOS_MOCK: Evento[] = [
  {
    id: 1,
    nombre: 'Torneo Nacional de Fútbol Sub-20',
    disciplina: 'Fútbol',
    categoria: 'Sub-20',
    genero: 'Masculino',
    lugar: 'Estadio Nacional, Bogotá',
    fechaInicio: '2024-02-15T09:00:00Z',
    fechaFin: '2024-02-18T18:00:00Z',
    horaInicio: '09:00',
    horaFin: '18:00',
    descripcion: 'Torneo nacional clasificatorio para el campeonato sudamericano',
    numeroParticipantes: 320,
    numeroOficiales: 12,
    estado: 'programado',
    organizador: 'Federación Colombiana de Fútbol',
    contacto: 'Carlos Rodríguez',
    telefono: '+57 301 234 5678',
    email: 'carlos.rodriguez@fcf.com.co',
    observaciones: 'Requiere documentación completa de jugadores',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 2,
    nombre: 'Campeonato Departamental de Atletismo',
    disciplina: 'Atletismo',
    categoria: 'Juvenil',
    genero: 'Mixto',
    lugar: 'Pista de Atletismo El Salitre, Bogotá',
    fechaInicio: '2024-03-05T08:00:00Z',
    fechaFin: '2024-03-07T17:00:00Z',
    horaInicio: '08:00',
    horaFin: '17:00',
    descripcion: 'Competencia departamental de atletismo en todas las modalidades',
    numeroParticipantes: 180,
    numeroOficiales: 8,
    estado: 'programado',
    organizador: 'Liga de Atletismo de Cundinamarca',
    contacto: 'María González',
    telefono: '+57 312 987 6543',
    email: 'maria.gonzalez@atletismo.gov.co',
    observaciones: 'Incluye pruebas de pista y campo',
    createdAt: '2024-01-12T09:15:00Z',
    updatedAt: '2024-01-20T11:45:00Z'
  },
  {
    id: 3,
    nombre: 'Copa Nacional de Baloncesto Femenino',
    disciplina: 'Baloncesto',
    categoria: 'Senior',
    genero: 'Femenino',
    lugar: 'Coliseo El Campín, Bogotá',
    fechaInicio: '2024-02-28T10:00:00Z',
    fechaFin: '2024-03-03T20:00:00Z',
    horaInicio: '10:00',
    horaFin: '20:00',
    descripcion: 'Torneo nacional de baloncesto femenino categoría senior',
    numeroParticipantes: 144,
    numeroOficiales: 6,
    estado: 'programado',
    organizador: 'Federación Colombiana de Baloncesto',
    contacto: 'Ana Martínez',
    telefono: '+57 320 456 7890',
    email: 'ana.martinez@fecolbal.com',
    observaciones: 'Torneo clasificatorio para juegos nacionales',
    createdAt: '2024-01-08T16:20:00Z',
    updatedAt: '2024-01-18T13:10:00Z'
  },
  {
    id: 4,
    nombre: 'Torneo Intercolegiado de Voleibol',
    disciplina: 'Voleibol',
    categoria: 'Juvenil',
    genero: 'Mixto',
    lugar: 'Polideportivo Universidad Nacional, Bogotá',
    fechaInicio: '2024-03-12T14:00:00Z',
    fechaFin: '2024-03-14T19:00:00Z',
    horaInicio: '14:00',
    horaFin: '19:00',
    descripcion: 'Competencia intercolegiada de voleibol para estudiantes',
    numeroParticipantes: 96,
    numeroOficiales: 4,
    estado: 'programado',
    organizador: 'Secretaría de Educación Distrital',
    contacto: 'Luis Pérez',
    telefono: '+57 315 123 4567',
    email: 'luis.perez@educacion.gov.co',
    observaciones: 'Solo para instituciones educativas registradas',
    createdAt: '2024-01-14T12:30:00Z',
    updatedAt: '2024-01-22T09:45:00Z'
  },
  {
    id: 5,
    nombre: 'Campeonato Nacional de Natación',
    disciplina: 'Natación',
    categoria: 'Absoluta',
    genero: 'Mixto',
    lugar: 'Piscina Olímpica Aquapark, Medellín',
    fechaInicio: '2024-04-10T07:00:00Z',
    fechaFin: '2024-04-13T18:00:00Z',
    horaInicio: '07:00',
    horaFin: '18:00',
    descripcion: 'Campeonato nacional de natación en todas las modalidades',
    numeroParticipantes: 250,
    numeroOficiales: 10,
    estado: 'programado',
    organizador: 'Federación Colombiana de Natación',
    contacto: 'Sandra López',
    telefono: '+57 304 789 0123',
    email: 'sandra.lopez@fedenatacion.com',
    observaciones: 'Incluye pruebas de velocidad y resistencia',
    createdAt: '2024-01-16T08:00:00Z',
    updatedAt: '2024-01-25T15:20:00Z'
  },
  {
    id: 6,
    nombre: 'Torneo Regional de Tenis',
    disciplina: 'Tenis',
    categoria: 'Junior',
    genero: 'Mixto',
    lugar: 'Club Campestre El Rancho, Cali',
    fechaInicio: '2024-03-20T08:30:00Z',
    fechaFin: '2024-03-24T17:30:00Z',
    horaInicio: '08:30',
    horaFin: '17:30',
    descripcion: 'Torneo regional de tenis individual y dobles',
    numeroParticipantes: 64,
    numeroOficiales: 3,
    estado: 'programado',
    organizador: 'Liga Vallecaucana de Tenis',
    contacto: 'Roberto Silva',
    telefono: '+57 318 654 3210',
    email: 'roberto.silva@tenisvalle.com',
    observaciones: 'Modalidades individual y dobles masculino/femenino',
    createdAt: '2024-01-18T11:15:00Z',
    updatedAt: '2024-01-28T16:40:00Z'
  },
  {
    id: 7,
    nombre: 'Copa Departamental de Ciclismo de Ruta',
    disciplina: 'Ciclismo',
    categoria: 'Elite',
    genero: 'Masculino',
    lugar: 'Circuito La Calera - Bogotá',
    fechaInicio: '2024-04-05T06:00:00Z',
    fechaFin: '2024-04-05T14:00:00Z',
    horaInicio: '06:00',
    horaFin: '14:00',
    descripcion: 'Competencia de ciclismo de ruta en circuito montañoso',
    numeroParticipantes: 120,
    numeroOficiales: 8,
    estado: 'programado',
    organizador: 'Liga de Ciclismo de Cundinamarca',
    contacto: 'Miguel Torres',
    telefono: '+57 311 987 6543',
    email: 'miguel.torres@ciclismocundi.com',
    observaciones: 'Recorrido de 85 km con desnivel positivo',
    createdAt: '2024-01-20T07:45:00Z',
    updatedAt: '2024-01-30T12:15:00Z'
  },
  {
    id: 8,
    nombre: 'Campeonato Nacional de Karate',
    disciplina: 'Karate',
    categoria: 'Senior',
    genero: 'Mixto',
    lugar: 'Dojo Nacional, Bogotá',
    fechaInicio: '2024-03-25T09:00:00Z',
    fechaFin: '2024-03-26T18:00:00Z',
    horaInicio: '09:00',
    horaFin: '18:00',
    descripcion: 'Campeonato nacional de karate modalidades kata y kumite',
    numeroParticipantes: 200,
    numeroOficiales: 12,
    estado: 'en_curso',
    organizador: 'Federación Colombiana de Karate',
    contacto: 'Hiroshi Tanaka',
    telefono: '+57 317 234 5678',
    email: 'hiroshi.tanaka@karatecolombiano.com',
    observaciones: 'Competencia en modalidades kata y kumite por categorías',
    createdAt: '2024-01-22T14:20:00Z',
    updatedAt: '2024-03-25T08:30:00Z'
  }
];

// Función para obtener eventos (simula API call)
export const getEventosMock = async (filters?: any): Promise<{ eventos: Evento[], total: number }> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let eventosFiltrados = [...EVENTOS_MOCK];
  
  if (filters?.search) {
    const searchTerm = filters.search.toLowerCase();
    eventosFiltrados = eventosFiltrados.filter(evento =>
      evento.nombre.toLowerCase().includes(searchTerm) ||
      evento.disciplina.toLowerCase().includes(searchTerm) ||
      evento.lugar.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters?.disciplina) {
    eventosFiltrados = eventosFiltrados.filter(evento => 
      evento.disciplina === filters.disciplina
    );
  }
  
  if (filters?.categoria) {
    eventosFiltrados = eventosFiltrados.filter(evento => 
      evento.categoria === filters.categoria
    );
  }
  
  if (filters?.genero) {
    eventosFiltrados = eventosFiltrados.filter(evento => 
      evento.genero === filters.genero
    );
  }
  
  if (filters?.estado) {
    eventosFiltrados = eventosFiltrados.filter(evento => 
      evento.estado === filters.estado
    );
  }
  
  return {
    eventos: eventosFiltrados,
    total: eventosFiltrados.length
  };
};

// Función para obtener evento por ID
export const getEventoByIdMock = async (id: number): Promise<Evento | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return EVENTOS_MOCK.find(evento => evento.id === id) || null;
};
