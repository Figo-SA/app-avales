import React from "react";
import { MenuOption, MenuSection } from "./MenuComponents";

interface SupportSectionProps {
  onSupport: () => void;
  onAbout: () => void;
}

export const SupportSection = ({ onSupport, onAbout }: SupportSectionProps) => {
  return (
    <MenuSection title="Ayuda y Soporte">
      <MenuOption
        title="Centro de Ayuda"
        subtitle="Encuentra respuestas a tus preguntas"
        icon="ion:help-circle"
        onPress={onSupport}
      />
      <MenuOption
        title="Contactar Soporte"
        subtitle="Obtén ayuda personalizada"
        icon="ion:chatbubble-ellipses"
        onPress={onSupport}
      />
      <MenuOption
        title="Acerca de"
        subtitle="Información de la aplicación"
        icon="ion:information-circle"
        onPress={onAbout}
      />
    </MenuSection>
  );
};
