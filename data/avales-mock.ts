export interface AvalCompleto {
  id: number;
  nombreEvento: string;
  disciplina: string;
  categoria: string;
  genero: string;
  lugar: string;
  fechaEvento: string;
  fechaSolicitud: string;
  estado: 'aprobado' | 'en_revision' | 'rechazado' | 'pendiente';
  numeroAtletas: number;
  numeroOficiales: number;
  descripcion: string;
  observaciones?: string;
  motivoRechazo?: string;
  fechaAprobacion?: string;
  fechaRechazo?: string;
  solicitante: {
    nombre: string;
    cargo: string;
    organizacion: string;
  };
  requerimientos: {
    transporte: string;
    hospedaje: string;
    alimentacion: string;
    presupuesto: number;
  };
}

export const AVALES_MOCK: AvalCompleto[] = [
  {
    id: 1,
    nombreEvento: "Torneo Nacional de Fútbol Sub-20",
    disciplina: "Fútbol",
    categoria: "Sub-20",
    genero: "Masculino",
    lugar: "Estadio Nacional, Bogotá",
    fechaEvento: "2024-02-15T09:00:00Z",
    fechaSolicitud: "2024-01-10T10:00:00Z",
    estado: "aprobado",
    numeroAtletas: 320,
    numeroOficiales: 12,
    descripcion: "Torneo nacional clasificatorio para el campeonato sudamericano",
    observaciones: "Aprobado con todas las condiciones solicitadas",
    fechaAprobacion: "2024-01-20T14:30:00Z",
    solicitante: {
      nombre: "Carlos Rodríguez",
      cargo: "Director Técnico",
      organizacion: "Federación Colombiana de Fútbol"
    },
    requerimientos: {
      transporte: "Bus",
      hospedaje: "Hotel 4 estrellas",
      alimentacion: "Pensión completa",
      presupuesto: 45000000
    }
  },
  {
    id: 2,
    nombreEvento: "Campeonato Departamental de Atletismo",
    disciplina: "Atletismo",
    categoria: "Juvenil",
    genero: "Mixto",
    lugar: "Pista El Salitre, Bogotá",
    fechaEvento: "2024-03-05T08:00:00Z",
    fechaSolicitud: "2024-02-01T09:00:00Z",
    estado: "en_revision",
    numeroAtletas: 180,
    numeroOficiales: 8,
    descripcion: "Campeonato departamental de atletismo juvenil",
    observaciones: "En proceso de revisión por el comité técnico",
    solicitante: {
      nombre: "María González",
      cargo: "Coordinadora Deportiva",
      organizacion: "Liga de Atletismo de Bogotá"
    },
    requerimientos: {
      transporte: "Bus",
      hospedaje: "Hotel 3 estrellas",
      alimentacion: "Desayuno y almuerzo",
      presupuesto: 25000000
    }
  },
  {
    id: 3,
    nombreEvento: "Copa Nacional de Baloncesto Femenino",
    disciplina: "Baloncesto",
    categoria: "Senior",
    genero: "Femenino",
    lugar: "Coliseo El Campín, Bogotá",
    fechaEvento: "2024-04-10T18:00:00Z",
    fechaSolicitud: "2024-02-15T11:00:00Z",
    estado: "rechazado",
    numeroAtletas: 144,
    numeroOficiales: 6,
    descripcion: "Copa nacional de baloncesto femenino senior",
    motivoRechazo: "Presupuesto insuficiente y documentación incompleta. Faltan certificados médicos de los atletas y el cronograma detallado del evento.",
    fechaRechazo: "2024-02-25T16:00:00Z",
    solicitante: {
      nombre: "Ana Martínez",
      cargo: "Presidenta",
      organizacion: "Federación Colombiana de Baloncesto"
    },
    requerimientos: {
      transporte: "Avión",
      hospedaje: "Hotel 5 estrellas",
      alimentacion: "Pensión completa",
      presupuesto: 15000000 // Presupuesto insuficiente
    }
  },
  {
    id: 4,
    nombreEvento: "Torneo Intercolegiado de Voleibol",
    disciplina: "Voleibol",
    categoria: "Juvenil",
    genero: "Mixto",
    lugar: "Polideportivo UN, Bogotá",
    fechaEvento: "2024-05-20T14:00:00Z",
    fechaSolicitud: "2024-03-01T08:30:00Z",
    estado: "pendiente",
    numeroAtletas: 96,
    numeroOficiales: 4,
    descripcion: "Torneo intercolegiado de voleibol juvenil mixto",
    observaciones: "Solicitud recibida, pendiente de asignación para revisión",
    solicitante: {
      nombre: "Pedro Sánchez",
      cargo: "Coordinador Deportivo",
      organizacion: "Universidad Nacional"
    },
    requerimientos: {
      transporte: "Bus",
      hospedaje: "Residencias universitarias",
      alimentacion: "Almuerzo",
      presupuesto: 8000000
    }
  },
  {
    id: 5,
    nombreEvento: "Campeonato Nacional de Natación",
    disciplina: "Natación",
    categoria: "Absoluta",
    genero: "Mixto",
    lugar: "Piscina Olímpica, Medellín",
    fechaEvento: "2024-06-15T07:00:00Z",
    fechaSolicitud: "2024-03-10T10:15:00Z",
    estado: "aprobado",
    numeroAtletas: 250,
    numeroOficiales: 10,
    descripcion: "Campeonato nacional de natación categoría absoluta",
    observaciones: "Aprobado. Excelente propuesta técnica y presupuesto adecuado",
    fechaAprobacion: "2024-03-25T13:45:00Z",
    solicitante: {
      nombre: "Laura Jiménez",
      cargo: "Directora Técnica",
      organizacion: "Federación Colombiana de Natación"
    },
    requerimientos: {
      transporte: "Avión",
      hospedaje: "Hotel 4 estrellas",
      alimentacion: "Pensión completa",
      presupuesto: 60000000
    }
  }
];
