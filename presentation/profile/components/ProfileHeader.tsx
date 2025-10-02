import { User } from "@/core/auth/interface/user";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Surface, Text, useTheme } from "react-native-paper";

interface ProfileHeaderProps {
  user: User;
  onEditProfile: () => void;
}

export const ProfileHeader = ({ user, onEditProfile }: ProfileHeaderProps) => {
  const theme = useTheme();

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase();
  };

  const styles = createStyles(theme);

  return (
    <Surface style={styles.headerCard} elevation={4}>
      <View style={styles.cardContent}>
        {/* Background gradient effect */}
        <View style={styles.gradientBackground} />

        <View style={styles.headerContent}>
          <Avatar.Text
            size={90}
            label={getInitials(user?.nombre || "", user?.apellido || "")}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />

          <View style={styles.userInfo}>
            <Text variant="headlineSmall" style={styles.userName}>
              {user?.nombre} {user?.apellido}
            </Text>

            <Text variant="bodyMedium" style={styles.userEmail}>
              {user?.email}
            </Text>
            <Text variant="bodySmall" style={styles.userCedula}>
              C.I: {user?.cedula}
            </Text>
            <View style={styles.rolesContainer}>
              {user?.roles?.map((role, index) => (
                <View key={index} style={styles.roleChip}>
                  <Text variant="labelSmall" style={styles.roleText}>
                    {role}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.editButtonContainer}>
          <ThemeButton
            mode="outlined"
            icon="ion:create-outline"
            onPress={onEditProfile}
            style={styles.editButton}
          >
            Editar Perfil
          </ThemeButton>
        </View>
      </View>
    </Surface>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    headerCard: {
      margin: 16,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
    },
    cardContent: {
      borderRadius: 20,
      overflow: "hidden",
      position: "relative",
    },
    gradientBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      backgroundColor: theme.colors.primaryContainer,
      opacity: 0.3,
    },
    headerContent: {
      padding: 24,
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      zIndex: 1,
    },
    avatar: {
      backgroundColor: theme.colors.primary,
      marginRight: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    avatarLabel: {
      color: theme.colors.onPrimary,
      fontSize: 32,
      fontWeight: "bold",
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontWeight: "700",
      color: theme.colors.onSurface,
      fontSize: 18,
      marginBottom: 4,
    },
    userEmail: {
      color: theme.colors.onSurfaceVariant,
      marginBottom: 2,
    },
    userCedula: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
    },
    rolesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 12,
      gap: 6,
    },
    roleChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.colors.primaryContainer,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    roleText: {
      color: theme.colors.onSecondaryContainer,
      fontWeight: "600",
      fontSize: 11,
      textTransform: "uppercase",
    },

    editButtonContainer: {
      paddingHorizontal: 24,
      paddingBottom: 20,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
      backgroundColor: theme.colors.surface,
    },
    editButton: {
      borderRadius: 25,
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
    },
  });
