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

  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres?.[0] || ""}${apellidos?.[0] || ""}`.toUpperCase();
  };

  const styles = createStyles(theme);

  return (
    <Surface style={styles.headerCard} elevation={3}>
      <View style={styles.cardContent}>
        {/* Header gradient background */}
        <View style={styles.gradientContainer}>
          <View
            style={[
              styles.gradientBackground,
              { backgroundColor: theme.colors.primary },
            ]}
          />
          <View style={styles.gradientOverlay} />
        </View>

        <View style={styles.headerContent}>
          {/* Avatar with decorative ring */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarRing}>
              <Avatar.Text
                size={80}
                label={getInitials(user?.nombre || "", user?.apellido || "")}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text variant="titleLarge" style={styles.userName}>
              {user?.nombre} {user?.apellido}
            </Text>

            <View style={styles.emailContainer}>
              <Text variant="bodyMedium" style={styles.userEmail}>
                {user?.email}
              </Text>
            </View>

            {user?.cedula && (
              <View style={styles.cedulaContainer}>
                <Text variant="bodySmall" style={styles.userCedula}>
                  C.I: {user.cedula}
                </Text>
              </View>
            )}

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
            mode="contained"
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
      borderRadius: 24,
      backgroundColor: theme.colors.surface,
      overflow: "hidden",
    },
    cardContent: {
      borderRadius: 24,
      overflow: "hidden",
      position: "relative",
    },
    gradientContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      overflow: "hidden",
    },
    gradientBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      opacity: 0.15,
    },
    gradientOverlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 40,
      backgroundColor: theme.colors.surface,
      opacity: 0.8,
    },
    headerContent: {
      padding: 24,
      paddingTop: 28,
      flexDirection: "row",
      alignItems: "flex-start",
      position: "relative",
      zIndex: 1,
    },
    avatarContainer: {
      marginRight: 16,
    },
    avatarRing: {
      padding: 4,
      borderRadius: 50,
      backgroundColor: theme.colors.surface,
      shadowColor: theme.colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
    },
    avatar: {
      backgroundColor: theme.colors.primary,
    },
    avatarLabel: {
      color: "#FFFFFF",
      fontSize: 28,
      fontWeight: "700",
    },
    userInfo: {
      flex: 1,
      paddingTop: 8,
    },
    userName: {
      fontWeight: "700",
      color: theme.colors.onSurface,
      fontSize: 20,
      letterSpacing: -0.3,
      marginBottom: 6,
    },
    emailContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    userEmail: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 14,
    },
    cedulaContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    userCedula: {
      color: theme.colors.onSurfaceVariant,
      fontSize: 12,
      opacity: 0.8,
    },
    rolesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 14,
      gap: 8,
    },
    roleChip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 20,
      backgroundColor: theme.colors.primaryContainer,
    },
    roleText: {
      color: theme.colors.primary,
      fontWeight: "700",
      fontSize: 10,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    editButtonContainer: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      paddingTop: 8,
    },
    editButton: {
      borderRadius: 14,
    },
  });
