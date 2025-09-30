import { useAuthStore } from "@/presentation/auth/store/useAuthStore";
import { ThemeButton } from "@/presentation/theme/components/ThemedButton";
import { ThemedView } from "@/presentation/theme/components/ThemedView";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Surface, Switch, Text, useTheme } from "react-native-paper";

export default function ProfileScreen() {
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Mock data para estadísticas
  const stats = {
    totalAvales: 12,
    pendientes: 3,
    aprobados: 8,
    rechazados: 1,
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar Sesión",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  const handleEditProfile = () => {
    // TODO: Navegar a pantalla de edición de perfil
    Alert.alert("Próximamente", "Funcionalidad de edición en desarrollo");
  };

  const handleChangePassword = () => {
    // TODO: Navegar a pantalla de cambio de contraseña
    Alert.alert(
      "Próximamente",
      "Funcionalidad de cambio de contraseña en desarrollo"
    );
  };

  const handleSupport = () => {
    Alert.alert(
      "Soporte",
      "¿Necesitas ayuda? Contáctanos en soporte@avalesapp.com"
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "Acerca de",
      "AvalesApp v1.0.0\nDesarrollado para la gestión eficiente de avales deportivos."
    );
  };

  // Generar iniciales del usuario
  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase();
  };

  const StatCard = ({ title, value, icon, color }: any) => (
    <Surface
      style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
      elevation={2}
    >
      <View style={styles.statContent}>
        <View
          style={[styles.statIconContainer, { backgroundColor: color + "20" }]}
        >
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text
          variant="headlineSmall"
          style={[styles.statValue, { color: theme.colors.onSurface }]}
        >
          {value}
        </Text>
        <Text
          variant="bodySmall"
          style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}
        >
          {title}
        </Text>
      </View>
    </Surface>
  );

  const MenuOption = ({
    title,
    subtitle,
    icon,
    onPress,
    rightElement,
  }: any) => (
    <TouchableOpacity
      style={[
        styles.menuOption,
        { borderBottomColor: theme.colors.outline + "30" },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuOptionLeft}>
        <View
          style={[
            styles.menuIconContainer,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.menuTextContainer}>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
            {title}
          </Text>
          {subtitle && (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement || (
        <Ionicons
          name="chevron-forward"
          size={20}
          color={theme.colors.onSurfaceVariant}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <ThemedView>
        {/* Header con información del usuario */}
        <Surface
          style={[styles.headerCard, { backgroundColor: theme.colors.surface }]}
          elevation={3}
        >
          <View style={styles.headerContent}>
            <Avatar.Text
              size={80}
              label={getInitials(user?.nombre || "", user?.apellido || "")}
              style={{ backgroundColor: theme.colors.primary }}
              labelStyle={{
                color: theme.colors.onPrimary,
                fontSize: 28,
                fontWeight: "bold",
              }}
            />
            <View style={styles.userInfo}>
              <Text
                variant="headlineSmall"
                style={[styles.userName, { color: theme.colors.onSurface }]}
              >
                {user?.nombre} {user?.apellido}
              </Text>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                {user?.email}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                C.I: {user?.cedula}
              </Text>
              <View style={styles.rolesContainer}>
                {user?.roles?.map((role, index) => (
                  <Surface
                    key={index}
                    style={[
                      styles.roleChip,
                      { backgroundColor: theme.colors.secondaryContainer },
                    ]}
                    elevation={1}
                  >
                    <Text
                      variant="labelSmall"
                      style={{ color: theme.colors.onSecondaryContainer }}
                    >
                      {role}
                    </Text>
                  </Surface>
                ))}
              </View>
            </View>
            <ThemeButton
              mode="outlined"
              compact
              icon="create-outline"
              onPress={handleEditProfile}
              style={styles.editButton}
            >
              Editar
            </ThemeButton>
          </View>
        </Surface>

        {/* Estadísticas */}
        <View style={styles.statsSection}>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
          >
            Mis Estadísticas
          </Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Avales"
              value={stats.totalAvales}
              icon="document-text"
              color={theme.colors.primary}
            />
            <StatCard
              title="Pendientes"
              value={stats.pendientes}
              icon="time"
              color={theme.colors.secondary}
            />
            <StatCard
              title="Aprobados"
              value={stats.aprobados}
              icon="checkmark-circle"
              color="#4CAF50"
            />
            <StatCard
              title="Rechazados"
              value={stats.rechazados}
              icon="close-circle"
              color="#F44336"
            />
          </View>
        </View>

        {/* Configuración de Cuenta */}
        <View style={styles.section}>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
          >
            Configuración de Cuenta
          </Text>
          <Surface
            style={[
              styles.menuContainer,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={1}
          >
            <MenuOption
              title="Cambiar Contraseña"
              subtitle="Actualiza tu contraseña de acceso"
              icon="lock-closed"
              onPress={handleChangePassword}
            />
            <MenuOption
              title="Notificaciones"
              subtitle="Recibe alertas sobre tus avales"
              icon="notifications"
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  thumbColor={
                    notificationsEnabled
                      ? theme.colors.outlineVariant
                      : theme.colors.outline
                  }
                  trackColor={{
                    false: theme.colors.outline + "50",
                    true: theme.colors.primary + "50",
                  }}
                />
              }
            />
            <MenuOption
              title="Tema Oscuro"
              subtitle="Cambiar apariencia de la aplicación"
              icon="moon"
              onPress={() => setDarkModeEnabled(!darkModeEnabled)}
              rightElement={
                <Switch
                  value={darkModeEnabled}
                  onValueChange={setDarkModeEnabled}
                  thumbColor={
                    darkModeEnabled
                      ? theme.colors.outlineVariant
                      : theme.colors.outline
                  }
                  trackColor={{
                    false: theme.colors.outline + "50",
                    true: theme.colors.primary + "50",
                  }}
                />
              }
            />
          </Surface>
        </View>

        {/* Ayuda y Soporte */}
        <View style={styles.section}>
          <Text
            variant="titleMedium"
            style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
          >
            Ayuda y Soporte
          </Text>
          <Surface
            style={[
              styles.menuContainer,
              { backgroundColor: theme.colors.surface },
            ]}
            elevation={1}
          >
            <MenuOption
              title="Centro de Ayuda"
              subtitle="Encuentra respuestas a tus preguntas"
              icon="help-circle"
              onPress={handleSupport}
            />
            <MenuOption
              title="Contactar Soporte"
              subtitle="Obtén ayuda personalizada"
              icon="chatbubble-ellipses"
              onPress={handleSupport}
            />
            <MenuOption
              title="Acerca de"
              subtitle="Información de la aplicación"
              icon="information-circle"
              onPress={handleAbout}
            />
          </Surface>
        </View>

        {/* Botón de Cerrar Sesión */}
        <View style={styles.logoutSection}>
          <ThemeButton
            mode="contained"
            icon="log-out"
            onPress={handleLogout}
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            style={styles.logoutButton}
          >
            Cerrar Sesión
          </ThemeButton>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espacio para tab bar
  },
  headerCard: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  headerContent: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  rolesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  roleChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editButton: {
    marginLeft: 8,
  },
  statsSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    padding: 16,
  },
  statContent: {
    alignItems: "center",
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    textAlign: "center",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  menuContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
  },
  menuOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  logoutSection: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 4,
  },
});
