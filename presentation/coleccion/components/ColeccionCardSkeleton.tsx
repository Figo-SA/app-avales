import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Card, useTheme } from "react-native-paper";

const SkeletonBox = ({
  width,
  height,
  borderRadius = 4,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
}) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
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
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceVariant,
          opacity,
        },
      ]}
    />
  );
};

export const ColeccionCardSkeleton = () => {
  const theme = useTheme();

  return (
    <Card
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      mode="elevated"
    >
      <Card.Content style={styles.cardContent}>
        <View style={styles.header}>
          <SkeletonBox width={80} height={24} borderRadius={10} />
          <SkeletonBox width={70} height={16} borderRadius={4} />
        </View>

        <SkeletonBox width="90%" height={20} borderRadius={4} />
        <SkeletonBox width="60%" height={16} borderRadius={4} />

        <View style={styles.infoRow}>
          <SkeletonBox width={100} height={28} borderRadius={8} />
          <SkeletonBox width={120} height={28} borderRadius={8} />
        </View>

        <View style={styles.footer}>
          <SkeletonBox width={80} height={14} borderRadius={4} />
          <SkeletonBox width={60} height={14} borderRadius={4} />
        </View>
      </Card.Content>
    </Card>
  );
};

export const ColeccionListSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <ColeccionCardSkeleton key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
  },
  cardContent: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
  },
  footer: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 10,
  },
  listContainer: {
    padding: 16,
    gap: 12,
  },
});
