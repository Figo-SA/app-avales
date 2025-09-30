import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Modal,
  Portal,
  Button,
  Text,
  Chip,
  Divider,
  useTheme,
  SegmentedButtons,
} from 'react-native-paper';
import { EventoFilters } from '@/types/EventoTypes';

interface EventosFiltrosProps {
  visible: boolean;
  onDismiss: () => void;
  filters: EventoFilters;
  onApplyFilters: (filters: EventoFilters) => void;
  onClearFilters: () => void;
}

const DISCIPLINAS = [
  'Fútbol', 'Baloncesto', 'Voleibol', 'Atletismo', 'Natación',
  'Ciclismo', 'Tenis', 'Boxeo', 'Karate', 'Judo', 'Taekwondo'
];

const CATEGORIAS = [
  'Infantil', 'Juvenil', 'Junior', 'Senior', 'Master',
  'Sub-12', 'Sub-15', 'Sub-17', 'Sub-20', 'Absoluta'
];

const GENEROS = [
  { value: 'Masculino', label: 'Masculino' },
  { value: 'Femenino', label: 'Femenino' },
  { value: 'Mixto', label: 'Mixto' }
];

const ESTADOS = [
  { value: 'programado', label: 'Programado' },
  { value: 'en_curso', label: 'En Curso' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' }
];

export default function EventosFiltros({
  visible,
  onDismiss,
  filters,
  onApplyFilters,
  onClearFilters,
}: EventosFiltrosProps) {
  const theme = useTheme();
  const [localFilters, setLocalFilters] = useState<EventoFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onDismiss();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
    onDismiss();
  };

  const toggleDisciplina = (disciplina: string) => {
    setLocalFilters(prev => ({
      ...prev,
      disciplina: prev.disciplina === disciplina ? undefined : disciplina
    }));
  };

  const toggleCategoria = (categoria: string) => {
    setLocalFilters(prev => ({
      ...prev,
      categoria: prev.categoria === categoria ? undefined : categoria
    }));
  };

  const setGenero = (genero: string) => {
    setLocalFilters(prev => ({
      ...prev,
      genero: prev.genero === genero ? undefined : genero
    }));
  };

  const setEstado = (estado: string) => {
    setLocalFilters(prev => ({
      ...prev,
      estado: prev.estado === estado ? undefined : estado
    }));
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: theme.colors.surface,
          margin: 20,
          borderRadius: 12,
          maxHeight: '80%',
        }}
      >
        <View className="p-6">
          <Text variant="headlineSmall" className="mb-4">
            Filtrar Eventos
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Disciplinas */}
            <Text variant="titleMedium" className="mb-3">
              Disciplina
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {DISCIPLINAS.map((disciplina) => (
                <Chip
                  key={disciplina}
                  mode={localFilters.disciplina === disciplina ? 'flat' : 'outlined'}
                  selected={localFilters.disciplina === disciplina}
                  onPress={() => toggleDisciplina(disciplina)}
                  className="mr-2 mb-2"
                  compact
                >
                  {disciplina}
                </Chip>
              ))}
            </View>

            <Divider className="mb-4" />

            {/* Categorías */}
            <Text variant="titleMedium" className="mb-3">
              Categoría
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {CATEGORIAS.map((categoria) => (
                <Chip
                  key={categoria}
                  mode={localFilters.categoria === categoria ? 'flat' : 'outlined'}
                  selected={localFilters.categoria === categoria}
                  onPress={() => toggleCategoria(categoria)}
                  className="mr-2 mb-2"
                  compact
                >
                  {categoria}
                </Chip>
              ))}
            </View>

            <Divider className="mb-4" />

            {/* Género */}
            <Text variant="titleMedium" className="mb-3">
              Género
            </Text>
            <SegmentedButtons
              value={localFilters.genero || ''}
              onValueChange={setGenero}
              buttons={GENEROS}
              style={{ marginBottom: 16 }}
            />

            <Divider className="mb-4" />

            {/* Estado */}
            <Text variant="titleMedium" className="mb-3">
              Estado
            </Text>
            <SegmentedButtons
              value={localFilters.estado || ''}
              onValueChange={setEstado}
              buttons={ESTADOS}
              style={{ marginBottom: 24 }}
            />
          </ScrollView>

          {/* Botones de acción */}
          <View className="flex-row justify-between">
            <Button
              mode="outlined"
              onPress={handleClear}
              className="flex-1 mr-2"
            >
              Limpiar
            </Button>
            <Button
              mode="contained"
              onPress={handleApply}
              className="flex-1 ml-2"
            >
              Aplicar
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}
