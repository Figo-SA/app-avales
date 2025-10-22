export type TipoParticipante = "entrenador" | "atleta";
export type SexoParticipante = "masculino" | "femenino";

export interface Participante {
  id: string;
  tipo: TipoParticipante;
  sexo: SexoParticipante;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  edad?: number;
  eventoId: number; // codigoItem del evento
}

export interface ParticipantesPorCategoria {
  entrenadoresHombres: Participante[];
  entrenadoresMujeres: Participante[];
  atletasHombres: Participante[];
  atletasMujeres: Participante[];
}

export interface ResumenParticipantes {
  totalEntrenadoresHombres: number;
  totalEntrenadoresMujeres: number;
  totalAtletasHombres: number;
  totalAtletasMujeres: number;
  requeridos: {
    entrenadoresHombres: number;
    entrenadoresMujeres: number;
    atletasHombres: number;
    atletasMujeres: number;
  };
  completo: boolean;
}
