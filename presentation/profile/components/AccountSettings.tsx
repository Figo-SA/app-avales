import React, { useState } from "react";
import { Switch, useTheme } from "react-native-paper";
import { useThemeStore } from "../../theme/store/useThemeStore";
import { MenuOption, MenuSection } from "./MenuComponents";

interface AccountSettingsProps {
  onChangePassword: () => void;
}

export const AccountSettings = ({ onChangePassword }: AccountSettingsProps) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isDarkMode, toggleTheme } = useThemeStore();
  const theme = useTheme();

  return (
    <MenuSection title="Configuración de Cuenta">
      <MenuOption
        title="Cambiar Contraseña"
        subtitle="Actualiza tu contraseña de acceso"
        icon="ion:lock-closed"
        onPress={onChangePassword}
      />
      <MenuOption
        title="Notificaciones"
        subtitle="Recibe alertas sobre tus avales"
        icon="ion:notifications"
        onPress={() => setNotificationsEnabled(!notificationsEnabled)}
        rightElement={
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        }
      />
      <MenuOption
        title="Tema Oscuro"
        subtitle="Cambiar apariencia de la aplicación"
        icon="ion:moon"
        onPress={toggleTheme}
        rightElement={<Switch value={isDarkMode} onValueChange={toggleTheme} />}
      />
    </MenuSection>
  );
};
