import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { ThemedView } from './ThemedView';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/**
 * Componente para mostrar cuando no hay datos
 * Mejora la UX mostrando un mensaje claro en lugar de una pantalla vacía
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'ion:file-tray-outline',
  title,
  description,
  action,
}) => {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <Icon 
          source={icon} 
          size={80} 
          color={theme.colors.onSurfaceDisabled} 
        />
        
        <Text 
          variant="headlineSmall" 
          style={[styles.title, { color: theme.colors.onSurface }]}
        >
          {title}
        </Text>
        
        {description && (
          <Text 
            variant="bodyMedium" 
            style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
          >
            {description}
          </Text>
        )}
        
        {action && (
          <View style={styles.actionContainer}>
            {action}
          </View>
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  description: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionContainer: {
    marginTop: 24,
  },
});
