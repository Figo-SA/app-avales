import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, Chip, useTheme, Divider, IconButton } from 'react-native-paper';
import { AvalCompleto } from '@/data/avales-mock';

interface Props {
  aval: AvalCompleto;
  onClose: () => void;
}

export default function DetalleAvalScreen({ aval, onClose }: Props) {
  const theme = useTheme();

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'aprobado': return { bg: '#E8F5E8', text: '#2E7D32' };
      case 'en_revision': return { bg: '#FFF3E0', text: '#F57C00' };
      case 'rechazado': return { bg: '#FFEBEE', text: '#D32F2F' };
      case 'pendiente': return { bg: '#E3F2FD', text: '#1976D2' };
      default: return { bg: theme.colors.surfaceVariant, text: theme.colors.onSurfaceVariant };
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'aprobado': return 'Aprobado';
      case 'en_revision': return 'En Revisión';
      case 'rechazado': return 'Rechazado';
      case 'pendiente': return 'Pendiente';
      default: return estado;
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearPresupuesto = (presupuesto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(presupuesto);
  };

  const estadoColor = getEstadoColor(aval.estado);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text variant="headlineSmall" style={{ fontWeight: '700', color: theme.colors.onSurface }}>
              Detalle del Aval
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
              ID: #{aval.id}
            </Text>
          </View>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
            style={{ backgroundColor: theme.colors.surfaceVariant }}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Estado del Aval */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.estadoContainer}>
              <View style={[styles.estadoBadge, { backgroundColor: estadoColor.bg }]}>
                <Text variant="titleMedium" style={{ color: estadoColor.text, fontWeight: '700' }}>
                  {getEstadoTexto(aval.estado)}
                </Text>
              </View>
              
              {aval.estado === 'aprobado' && aval.fechaAprobacion && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                  Aprobado el {formatearFecha(aval.fechaAprobacion)}
                </Text>
              )}
              
              {aval.estado === 'rechazado' && aval.fechaRechazo && (
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
                  Rechazado el {formatearFecha(aval.fechaRechazo)}
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Información del Evento */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: '600', marginBottom: 16 }}>
              Información del Evento
            </Text>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Nombre:</Text>
              <Text variant="bodyLarge" style={styles.value}>{aval.nombreEvento}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Disciplina:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.disciplina}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Categoría:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.categoria}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Género:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.genero}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Lugar:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.lugar}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Fecha del Evento:</Text>
              <Text variant="bodyMedium" style={styles.value}>{formatearFecha(aval.fechaEvento)}</Text>
            </View>
            
            <Divider style={{ marginVertical: 12 }} />
            
            <Text variant="labelMedium" style={styles.label}>Descripción:</Text>
            <Text variant="bodyMedium" style={[styles.value, { marginTop: 4 }]}>{aval.descripcion}</Text>
          </Card.Content>
        </Card>

        {/* Participantes */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: '600', marginBottom: 16 }}>
              Participantes
            </Text>
            
            <View style={styles.participantesContainer}>
              <View style={styles.participanteItem}>
                <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: '700' }}>
                  {aval.numeroAtletas}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Atletas
                </Text>
              </View>
              
              <View style={styles.participanteItem}>
                <Text variant="headlineMedium" style={{ color: theme.colors.secondary, fontWeight: '700' }}>
                  {aval.numeroOficiales}
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Oficiales
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Solicitante */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: '600', marginBottom: 16 }}>
              Solicitante
            </Text>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Nombre:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.solicitante.nombre}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Cargo:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.solicitante.cargo}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Organización:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.solicitante.organizacion}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Requerimientos */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: '600', marginBottom: 16 }}>
              Requerimientos
            </Text>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Transporte:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.requerimientos.transporte}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Hospedaje:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.requerimientos.hospedaje}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Alimentación:</Text>
              <Text variant="bodyMedium" style={styles.value}>{aval.requerimientos.alimentacion}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Presupuesto:</Text>
              <Text variant="titleMedium" style={[styles.value, { color: theme.colors.primary, fontWeight: '600' }]}>
                {formatearPresupuesto(aval.requerimientos.presupuesto)}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Observaciones o Motivo de Rechazo */}
        {(aval.observaciones || aval.motivoRechazo) && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleLarge" style={{ fontWeight: '600', marginBottom: 16 }}>
                {aval.estado === 'rechazado' ? 'Motivo de Rechazo' : 'Observaciones'}
              </Text>
              
              <Text variant="bodyMedium" style={{ 
                color: aval.estado === 'rechazado' ? theme.colors.error : theme.colors.onSurface,
                lineHeight: 22
              }}>
                {aval.motivoRechazo || aval.observaciones}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Información de Solicitud */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface, marginBottom: 32 }]}>
          <Card.Content>
            <Text variant="titleLarge" style={{ fontWeight: '600', marginBottom: 16 }}>
              Información de Solicitud
            </Text>
            
            <View style={styles.infoRow}>
              <Text variant="labelMedium" style={styles.label}>Fecha de Solicitud:</Text>
              <Text variant="bodyMedium" style={styles.value}>{formatearFecha(aval.fechaSolicitud)}</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  estadoContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  estadoBadge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    color: '#333',
  },
  participantesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  participanteItem: {
    alignItems: 'center',
  },
});
