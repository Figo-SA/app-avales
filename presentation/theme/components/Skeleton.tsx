import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Componente Skeleton genérico con animación de fade
 * Útil para indicar carga de contenido
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <View style={[{ width, height }, style]}>
      <Animated.View
        style={[
          styles.skeleton,
          {
            width: '100%',
            height: '100%',
            borderRadius,
            opacity,
            backgroundColor: theme.dark 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
      />
    </View>
  );
};

/**
 * Skeleton circular para avatares
 */
export const SkeletonCircle: React.FC<{ size?: number; style?: ViewStyle }> = ({
  size = 40,
  style,
}) => {
  return <Skeleton width={size} height={size} borderRadius={size / 2} style={style} />;
};

/**
 * Contenedor para agrupar múltiples skeletons con espaciado
 */
export const SkeletonGroup: React.FC<{
  children: React.ReactNode;
  spacing?: number;
  style?: ViewStyle;
}> = ({ children, spacing = 8, style }) => {
  return (
    <View style={[{ gap: spacing }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
