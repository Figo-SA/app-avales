import React, { useEffect, useState } from 'react';
import { View, ScrollView, Alert, Dimensions, TouchableOpacity, Animated } from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  Searchbar,
  useTheme,
  ActivityIndicator,
  Surface,
  IconButton,
} from 'react-native-paper';
import { useEventos } from '@/presentation/eventos/hooks/useEventos';
import { Evento } from '@/types/EventoTypes';

const { width } = Dimensions.get('window');
const cardWidth = Math.floor((width - 40) / 2); // Ancho más amplio para 2 columnas

interface SeleccionEventoStepProps {
  eventoSeleccionado: Evento | null;
  onEventoSelect: (evento: Evento) => void;
  onContinuar: () => void;
}

const EventoCard: React.FC<{
  evento: Evento;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ evento, isSelected, onSelect }) => {
  const theme = useTheme();
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getDisciplinaIcon = (disciplina: string) => {
    switch (disciplina.toLowerCase()) {
      case 'fútbol': return 'soccer';
      case 'baloncesto': return 'basketball';
      case 'voleibol': return 'volleyball';
      case 'atletismo': return 'run';
      case 'natación': return 'swim';
      case 'tenis': return 'tennis';
      case 'ciclismo': return 'bike';
      case 'karate': return 'karate';
      default: return 'trophy';
    }
  };

  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return fecha;
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'programado': { bg: '#E3F2FD', text: '#1976D2' },
      'en_curso': { bg: '#FFF3E0', text: '#F57C00' },
      'finalizado': { bg: '#E8F5E8', text: '#388E3C' },
      'cancelado': { bg: '#FFEBEE', text: '#D32F2F' }
    };
    return colors[estado as keyof typeof colors] || colors.programado;
  };

  const badge = getEstadoBadge(evento.estado);

  return (
    <TouchableOpacity
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Card
          mode="elevated"
          style={{
            width: cardWidth,
            height: 160,
            margin: 4,
            backgroundColor: theme.colors.surface,
            borderWidth: isSelected ? 2 : 0,
            borderColor: isSelected ? theme.colors.primary : 'transparent',
          }}
        >
          <Card.Content style={{ padding: 12, height: '100%', justifyContent: 'space-between' }}>
            {/* Header */}
            <View>
              <View className="flex-row justify-between items-start mb-2">
                <Text variant="labelSmall" style={{ 
                  color: theme.colors.primary, 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  fontSize: 10
                }} numberOfLines={1}>
                  {evento.disciplina}
                </Text>
                
                {isSelected && (
                  <View style={{
                    backgroundColor: theme.colors.primary,
                    borderRadius: 8,
                    width: 16,
                    height: 16,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</Text>
                  </View>
                )}
              </View>

              {/* Título */}
              <Text 
                variant="titleSmall" 
                numberOfLines={2}
                style={{ 
                  fontWeight: '600',
                  marginBottom: 6,
                  lineHeight: 14,
                  color: theme.colors.onSurface,
                  fontSize: 12
                }}
              >
                {evento.nombre}
              </Text>

              {/* Info */}
              <View>
                <Text variant="bodySmall" numberOfLines={1} 
                  style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginBottom: 1 }}>
                  {evento.lugar.split(',')[0]}
                </Text>
                
                <Text variant="bodySmall" 
                  style={{ color: theme.colors.onSurfaceVariant, fontSize: 10, marginBottom: 1 }}>
                  {formatearFecha(evento.fechaInicio)}
                </Text>

                <Text variant="bodySmall" 
                  style={{ color: theme.colors.onSurfaceVariant, fontSize: 10 }}>
                  {evento.numeroParticipantes || 0} atletas
                </Text>
              </View>
            </View>

            {/* Footer */}
            <View className="flex-row justify-between items-center">
              <Text variant="labelSmall" style={{ 
                color: theme.colors.primary,
                fontSize: 8,
                fontWeight: '600'
              }} numberOfLines={1}>
                {evento.estado.replace('_', ' ')}
              </Text>
              
              <Text variant="labelSmall" style={{ 
                color: theme.colors.outline,
                fontSize: 8
              }} numberOfLines={1}>
                {evento.categoria}
              </Text>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function SeleccionEventoStep({
  eventoSeleccionado,
  onEventoSelect,
  onContinuar
}: SeleccionEventoStepProps) {
  const theme = useTheme();
  const { eventos, loading, error, buscarEventos, refrescarEventos } = useEventos();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    refrescarEventos();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    buscarEventos(query);
  };

  const handleEventoSelect = (evento: Evento) => {
    if (evento.estado === 'cancelado') {
      Alert.alert(
        'Evento Cancelado',
        'No puedes crear un aval para un evento cancelado.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Seleccionar evento y continuar inmediatamente
    onEventoSelect(evento);
    onContinuar();
  };

  const handleContinuar = () => {
    if (!eventoSeleccionado) {
      Alert.alert(
        'Selecciona un Evento',
        'Debes seleccionar un evento antes de continuar.',
        [{ text: 'OK' }]
      );
      return;
    }
    onContinuar();
  };

  if (loading && eventos.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-8">
        <ActivityIndicator size="large" />
        <Text variant="bodyMedium" className="mt-4 text-center">
          Cargando eventos disponibles...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: theme.colors.background }}>
      {/* Header limpio y moderno */}
      <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
        <Text variant="headlineMedium" style={{ 
          fontWeight: '800', 
          color: theme.colors.onSurface,
          marginBottom: 8
        }}>
          Elige tu Evento
        </Text>
        
        <Text variant="bodyLarge" style={{ 
          color: theme.colors.onSurfaceVariant,
          marginBottom: 20,
          lineHeight: 22
        }}>
          Selecciona el evento deportivo y crearemos tu aval automáticamente
        </Text>

        <Searchbar
          placeholder="Buscar eventos..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={{
            backgroundColor: theme.colors.surfaceVariant,
            borderRadius: 16,
            elevation: 0,
          }}
          inputStyle={{ fontSize: 16 }}
          iconColor={theme.colors.primary}
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: 80 
        }}
      >
        {error && (
          <View style={{
            margin: 16,
            padding: 16,
            borderRadius: 12,
            backgroundColor: theme.colors.errorContainer,
          }}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
              {error}
            </Text>
          </View>
        )}

        {eventos.length === 0 && !loading ? (
          <View className="flex-1 justify-center items-center" style={{ paddingTop: 60 }}>
            <Text variant="headlineSmall" className="text-center mb-2" style={{ fontWeight: '600' }}>
              No hay eventos
            </Text>
            <Text variant="bodyMedium" className="text-center mb-6" style={{ 
              color: theme.colors.outline, 
              lineHeight: 20,
              paddingHorizontal: 40
            }}>
              {searchQuery 
                ? 'No encontramos eventos con esos términos'
                : 'No hay eventos disponibles ahora'
              }
            </Text>
            <Button 
              mode="contained-tonal" 
              onPress={() => refrescarEventos()}
              icon="refresh"
            >
              Actualizar
            </Button>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 12 }}>
            {/* Renderizar en filas de 2 columnas */}
            {Array.from({ length: Math.ceil(eventos.length / 2) }, (_, rowIndex) => (
              <View key={rowIndex} style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                marginBottom: 8
              }}>
                {eventos.slice(rowIndex * 2, rowIndex * 2 + 2).map((evento) => (
                  <EventoCard
                    key={evento.id}
                    evento={evento}
                    isSelected={eventoSeleccionado?.id === evento.id}
                    onSelect={() => handleEventoSelect(evento)}
                  />
                ))}
                {/* Espaciador si hay número impar de eventos */}
                {eventos.slice(rowIndex * 2, rowIndex * 2 + 2).length === 1 && (
                  <View style={{ width: cardWidth, margin: 4 }} />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Indicador de ayuda simple */}
      <View 
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: theme.colors.surface,
          borderRadius: 16,
          paddingVertical: 12,
          paddingHorizontal: 20,
          elevation: 2,
        }}
      >
        <Text variant="bodyMedium" style={{ 
          color: theme.colors.onSurfaceVariant,
          textAlign: 'center',
          fontWeight: '500'
        }}>
          Toca cualquier evento para continuar
        </Text>
      </View>
    </View>
  );
}
