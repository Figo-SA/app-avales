import { Evento } from "@/core/eventos/interfaces/evento";
import {
  Participante,
  ParticipantesPorCategoria,
  SexoParticipante,
  TipoParticipante,
} from "@/core/participants/interfaces/participante";
import { useState } from "react";

interface ModalState {
  visible: boolean;
  tipo: TipoParticipante | null;
  sexo: SexoParticipante | null;
}

export const useParticipantes = (evento: Evento) => {
  const [participantes, setParticipantes] = useState<ParticipantesPorCategoria>({
    entrenadoresHombres: [],
    entrenadoresMujeres: [],
    atletasHombres: [],
    atletasMujeres: [],
  });

  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    tipo: null,
    sexo: null,
  });

  const progreso = {
    entrenadoresHombres: {
      actual: participantes.entrenadoresHombres.length,
      requerido: evento.numEntrenadoresHombres,
      porcentaje:
        evento.numEntrenadoresHombres > 0
          ? participantes.entrenadoresHombres.length /
            evento.numEntrenadoresHombres
          : 1,
    },
    entrenadoresMujeres: {
      actual: participantes.entrenadoresMujeres.length,
      requerido: evento.numEntrenadoresMujeres,
      porcentaje:
        evento.numEntrenadoresMujeres > 0
          ? participantes.entrenadoresMujeres.length /
            evento.numEntrenadoresMujeres
          : 1,
    },
    atletasHombres: {
      actual: participantes.atletasHombres.length,
      requerido: evento.numAtletasHombres,
      porcentaje:
        evento.numAtletasHombres > 0
          ? participantes.atletasHombres.length / evento.numAtletasHombres
          : 1,
    },
    atletasMujeres: {
      actual: participantes.atletasMujeres.length,
      requerido: evento.numAtletasMujeres,
      porcentaje:
        evento.numAtletasMujeres > 0
          ? participantes.atletasMujeres.length / evento.numAtletasMujeres
          : 1,
    },
  };

  const abrirModal = (tipo: TipoParticipante, sexo: SexoParticipante) => {
    setModalState({ visible: true, tipo, sexo });
  };

  const cerrarModal = () => {
    setModalState({ visible: false, tipo: null, sexo: null });
  };

  const agregarParticipantes = (nuevosParticipantes: Participante[]) => {
    if (nuevosParticipantes.length === 0) return;
    
    const { tipo, sexo } = nuevosParticipantes[0];
    
    if (tipo === "entrenador" && sexo === "masculino") {
      setParticipantes((prev) => ({
        ...prev,
        entrenadoresHombres: [...prev.entrenadoresHombres, ...nuevosParticipantes],
      }));
    } else if (tipo === "entrenador" && sexo === "femenino") {
      setParticipantes((prev) => ({
        ...prev,
        entrenadoresMujeres: [...prev.entrenadoresMujeres, ...nuevosParticipantes],
      }));
    } else if (tipo === "atleta" && sexo === "masculino") {
      setParticipantes((prev) => ({
        ...prev,
        atletasHombres: [...prev.atletasHombres, ...nuevosParticipantes],
      }));
    } else if (tipo === "atleta" && sexo === "femenino") {
      setParticipantes((prev) => ({
        ...prev,
        atletasMujeres: [...prev.atletasMujeres, ...nuevosParticipantes],
      }));
    }
  };

  const eliminarParticipante = (
    categoria: keyof ParticipantesPorCategoria,
    id: string
  ) => {
    setParticipantes((prev) => ({
      ...prev,
      [categoria]: prev[categoria].filter((p) => p.id !== id),
    }));
  };

  const todoCompleto =
    progreso.entrenadoresHombres.porcentaje >= 1 &&
    progreso.entrenadoresMujeres.porcentaje >= 1 &&
    progreso.atletasHombres.porcentaje >= 1 &&
    progreso.atletasMujeres.porcentaje >= 1;

  return {
    participantes,
    progreso,
    modalState,
    abrirModal,
    cerrarModal,
    agregarParticipantes,
    eliminarParticipante,
    todoCompleto,
  };
};
