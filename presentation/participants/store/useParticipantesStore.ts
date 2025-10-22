import { 
  getParticipantesByEvento, 
  saveParticipantes 
} from "@/core/participants/actions/participants-actions";
import { ParticipantesPorCategoria } from "@/core/participants/interfaces/participante";
import { create } from "zustand";

interface ParticipantesState {
  participantes: ParticipantesPorCategoria;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchParticipantes: (eventoId: number) => Promise<void>;
  setParticipantes: (participantes: ParticipantesPorCategoria) => void;
  guardarParticipantes: (eventoId: number) => Promise<void>;
  reset: () => void;
}

const initialState: ParticipantesPorCategoria = {
  entrenadoresHombres: [],
  entrenadoresMujeres: [],
  atletasHombres: [],
  atletasMujeres: [],
};

export const useParticipantesStore = create<ParticipantesState>((set, get) => ({
  participantes: initialState,
  isLoading: false,
  error: null,

  fetchParticipantes: async (eventoId: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getParticipantesByEvento(eventoId);
      set({ participantes: data, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Error al cargar participantes", 
        isLoading: false 
      });
    }
  },

  setParticipantes: (participantes: ParticipantesPorCategoria) => {
    set({ participantes });
  },

  guardarParticipantes: async (eventoId: number) => {
    set({ isLoading: true, error: null });
    try {
      const { participantes } = get();
      await saveParticipantes(eventoId, participantes);
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : "Error al guardar participantes", 
        isLoading: false 
      });
      throw error;
    }
  },

  reset: () => {
    set({ participantes: initialState, error: null, isLoading: false });
  },
}));
