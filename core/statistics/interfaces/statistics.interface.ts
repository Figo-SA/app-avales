// Interfaces para las estadísticas

export interface CountItem {
  label: string;
  value: number;
  color?: string;
}

export interface DashboardStats {
  totalAvales: number;
  avalesPendientes: number;
  avalesAprobados: number;
  avalesRechazados: number;
  totalEventos: number;
  totalDeportistas: number;
  totalEntrenadores: number;
}

export interface AvalesPorEstado {
  items: CountItem[];
  total: number;
}

export interface AvalesPorEtapa {
  items: CountItem[];
  total: number;
}

export interface TimelineItem {
  mes: string;
  label: string;
  creados: number;
  aprobados: number;
  rechazados: number;
}

export interface AvalesTimeline {
  items: TimelineItem[];
}

export interface DistribucionPorDisciplina {
  items: CountItem[];
  total: number;
}

export interface DistribucionPorCategoria {
  items: CountItem[];
  total: number;
}

export interface AllStatistics {
  dashboard: DashboardStats;
  porEstado: AvalesPorEstado;
  porEtapa: AvalesPorEtapa;
  timeline: AvalesTimeline;
  porDisciplina: DistribucionPorDisciplina;
  porCategoria: DistribucionPorCategoria;
}

export interface StatisticsQuery {
  fechaInicio?: string;
  fechaFin?: string;
  disciplinaId?: number;
  categoriaId?: number;
}
