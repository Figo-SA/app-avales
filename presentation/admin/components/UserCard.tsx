import type { User } from "@/core/auth/interface/user";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";

interface UserCardProps {
  user: User;
  onPress: () => void;
}

export const UserCard = ({ user, onPress }: UserCardProps) => {
  const theme = useTheme();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
      <Card
        style={[styles.card, { backgroundColor: theme.colors.surface }]}
        mode="elevated"
      >
        <Card.Content style={styles.cardContent}>
          {/* Header con nombre y email */}
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Icon
                source="ion:person"
                size={20}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text
                variant="titleMedium"
                style={[styles.name, { color: theme.colors.onSurface }]}
                numberOfLines={1}
              >
                {user.nombre} {user.apellido}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
                numberOfLines={1}
              >
                {user.email}
              </Text>
            </View>
          </View>

          {/* Info chips */}
          <View style={styles.infoRow}>
            {user.cedula ? (
              <View
                style={[
                  styles.infoChip,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <Icon
                  source="ion:card-outline"
                  size={14}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.infoText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {user.cedula}
                </Text>
              </View>
            ) : null}
            <View
              style={[
                styles.infoChip,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Icon
                source="ion:shield-outline"
                size={14}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {user.roles.length} rol{user.roles.length !== 1 ? "es" : ""}
              </Text>
            </View>
          </View>

          {/* Footer con roles */}
          <View
            style={[
              styles.footer,
              { borderTopColor: theme.colors.surfaceVariant },
            ]}
          >
            <View style={styles.roles}>
              {user.roles.map((role) => (
                <View
                  key={role}
                  style={[
                    styles.roleBadge,
                    { backgroundColor: theme.colors.secondaryContainer },
                  ]}
                >
                  <Text
                    style={[
                      styles.roleText,
                      { color: theme.colors.onSecondaryContainer },
                    ]}
                  >
                    {role}
                  </Text>
                </View>
              ))}
            </View>
            <View style={{ flex: 1 }} />
            <Icon
              source="ion:chevron-forward"
              size={20}
              color={theme.colors.outline}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    marginBottom: 12,
  },
  cardContent: {
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 11,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 6,
  },
  roles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flexShrink: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
