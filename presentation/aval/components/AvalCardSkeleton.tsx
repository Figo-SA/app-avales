import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { Skeleton, SkeletonGroup } from '@/presentation/theme/components/Skeleton';

/**
 * Skeleton que replica la estructura de AvalCard
 * Se muestra durante la carga de avales
 */
export const AvalCardSkeleton: React.FC = () => {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        {/* Header con Título y Deporte */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            {/* Título del evento */}
            <Skeleton width="80%" height={22} style={{ marginBottom: 8 }} />
            
            {/* Deporte */}
            <View style={styles.infoRow}>
              <Skeleton width={14} height={14} borderRadius={7} />
              <Skeleton width={80} height={14} style={{ marginLeft: 6 }} />
            </View>
          </View>

          {/* Chip de estado */}
          <Skeleton width={90} height={32} borderRadius={16} />
        </View>

        {/* Ubicación */}
        <SkeletonGroup spacing={4} style={{ marginTop: 12 }}>
          <View style={styles.infoRow}>
            <Skeleton width={16} height={16} borderRadius={8} />
            <Skeleton width="70%" height={14} style={{ marginLeft: 8 }} />
          </View>

          {/* Fechas */}
          <View style={styles.infoRow}>
            <Skeleton width={16} height={16} borderRadius={8} />
            <Skeleton width="50%" height={14} style={{ marginLeft: 8 }} />
          </View>
        </SkeletonGroup>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
            <Skeleton width={60} height={16} style={{ marginTop: 2 }} />
          </View>

          <View style={styles.statItem}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
            <Skeleton width={60} height={16} style={{ marginTop: 2 }} />
          </View>

          <View style={styles.statItem}>
            <Skeleton width={24} height={24} borderRadius={12} />
            <Skeleton width={80} height={12} style={{ marginTop: 4 }} />
            <Skeleton width={60} height={16} style={{ marginTop: 2 }} />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

/**
 * Lista de skeletons para mostrar durante carga inicial
 */
export const AvalListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <AvalCardSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical: 8,
  },
});
