// types/AvalTypes.ts
export interface ColeccionAval {
  descripcion: string;
  disciplina: string;
  categoria: string;
  genero: string;
  nombreEvento: string;
  lugar: string;
}

export interface AvalTecnico {
  fechaSalida: Date;
  horaSalida: string;
  fechaRetorno: Date;
  horaRetorno: string;
  transporteSalida: string;
  transporteRetorno: string;
  numeroOficiales: number;
  numeroAtletas: number;
}

export interface DeportistaAval {
  deportistaId: string;
  nombre: string;
  cedula: string;
  rol: string;
  selected: boolean;
}

export interface AvalObjetivo {
  descripcion: string;
}

export interface AvalCriterio {
  descripcion: string;
}

export interface AvalRequerimiento {
  rubro: string;
  cantidadDias: number;
  valorUnitario: number;
}

export interface SolicitudCompleta {
  coleccionAval: ColeccionAval;
  avalTecnico: AvalTecnico;
  deportistas: DeportistaAval[];
  objetivos: AvalObjetivo[];
  criterios: AvalCriterio[];
  requerimientos: AvalRequerimiento[];
  documento?: any;
}
