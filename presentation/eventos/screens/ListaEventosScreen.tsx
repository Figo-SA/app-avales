import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { 
  Text, 
  Card, 
  Button, 
  Chip, 
  Searchbar, 
  FAB,
  useTheme,
  ActivityIndicator,
  Snackbar,
  IconButton
} from 'react-native-paper';
import { useEventos } from '../hooks/useEventos';
import { Evento } from '@/types/EventoTypes';
import { useRouter } from 'expo-router';
import EventosFiltros from '../components/EventosFiltros';
// Función simple para formatear fechas
const formatearFecha = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return fecha;
  }
};

interface EventoCardProps {
  evento: Evento;
  onCrearAval: (evento: Evento) => void;
}

const EventoCard: React.FC<EventoCardProps> = ({ evento, onCrearAval }) => {
  const theme = useTheme();
  
  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'programado': return theme.colors.primary;
      case 'en_curso': return theme.colors.tertiary;
      case 'finalizado': return theme.colors.outline;
      case 'cancelado': return theme.colors.error;
      default: return theme.colors.outline;
    }
  };

  const formatFecha = (fecha: string) => {
    return formatearFecha(fecha);
  };

  return (
    <Card className="mb-4 mx-4" mode="outlined">
      <Card.Content>
        <View className="flex-row justify-between items-start mb-2">
          <Text variant="titleMedium" className="flex-1 mr-2">
            {evento.nombre}
          </Text>
          <Chip 
            mode="outlined" 
            textStyle={{ color: getEstadoColor(evento.estado) }}
            style={{ borderColor: getEstadoColor(evento.estado) }}
          >
            {evento.estado.replace('_', ' ')}
          </Chip>
        </View>
        
        <View className="mb-3">
          <Text variant="bodyMedium" className="text-gray-600 mb-1">
            📍 {evento.lugar}
          </Text>
          <Text variant="bodyMedium" className="text-gray-600 mb-1">
            🏃 {evento.disciplina} • {evento.categoria} • {evento.genero}
          </Text>
          <Text variant="bodyMedium" className="text-gray-600">
            📅 {formatFecha(evento.fechaInicio)} - {formatFecha(evento.fechaFin)}
          </Text>
        </View>

        {evento.descripcion && (
          <Text variant="bodySmall" className="text-gray-500 mb-3" numberOfLines={2}>
            {evento.descripcion}
          </Text>
        )}

        <View className="flex-row justify-between items-center">
          <View className="flex-row">
            {evento.numeroParticipantes && (
              <Text variant="bodySmall" className="text-gray-500 mr-4">
                👥 {evento.numeroParticipantes} atletas
              </Text>
            )}
            {evento.numeroOficiales && (
              <Text variant="bodySmall" className="text-gray-500">
                👨‍💼 {evento.numeroOficiales} oficiales
              </Text>
            )}
          </View>
          
          <Button 
            mode="contained-tonal"
            onPress={() => onCrearAval(evento)}
            disabled={evento.estado === 'cancelado'}
            compact
          >
            Crear Aval
          </Button>
        </View>
      </Card.Content>
    </Card>
  );
};

export default function ListaEventosScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    eventos,
    loading,
    error,
    filters,
    buscarEventos,
    aplicarFiltros,
    refrescarEventos,
    clearFilters,
    clearError,
  } = useEventos();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filtrosVisible, setFiltrosVisible] = useState(false);

  useEffect(() => {
    refrescarEventos();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refrescarEventos();
    setRefreshing(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    buscarEventos(query);
  };

  const handleCrearAval = (evento: Evento) => {
    // Navegar al formulario de aval con los datos del evento
    router.push({
      pathname: '/nuevo-aval',
      params: { eventoId: evento.id.toString() }
    });
  };

  const handleCrearEvento = () => {
    // Navegar a crear nuevo evento (implementar más tarde)
    console.log('Crear nuevo evento');
  };

  if (loading && eventos.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" className="mt-2">
          Cargando eventos...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <Searchbar
            placeholder="Buscar eventos..."
            onChangeText={handleSearch}
            value={searchQuery}
            className="flex-1 mr-2"
          />
          <IconButton
            icon="tune"
            mode="outlined"
            onPress={() => setFiltrosVisible(true)}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {eventos.length === 0 ? (
          <View className="flex-1 justify-center items-center p-8">
            <Text variant="headlineSmall" className="text-center mb-2">
              No hay eventos
            </Text>
            <Text variant="bodyMedium" className="text-center text-gray-500">
              No se encontraron eventos que coincidan con tu búsqueda
            </Text>
          </View>
        ) : (
          <View className="pb-20">
            {eventos.map((evento) => (
              <EventoCard
                key={evento.id}
                evento={evento}
                onCrearAval={handleCrearAval}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={handleCrearEvento}
      />

      <Snackbar
        visible={!!error}
        onDismiss={clearError}
        action={{
          label: 'Reintentar',
          onPress: refrescarEventos,
        }}
      >
        {error}
      </Snackbar>

      <EventosFiltros
        visible={filtrosVisible}
        onDismiss={() => setFiltrosVisible(false)}
        filters={filters}
        onApplyFilters={aplicarFiltros}
        onClearFilters={clearFilters}
      />
    </View>
  );
}
