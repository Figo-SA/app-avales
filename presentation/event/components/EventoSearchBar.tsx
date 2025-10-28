import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar, useTheme } from "react-native-paper";

interface EventoSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const EventoSearchBar = ({
  value,
  onChangeText,
  placeholder = "Buscar eventos...",
}: EventoSearchBarProps) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [localValue, setLocalValue] = useState(value);

  // Debounce: esperar 500ms después de que el usuario deje de escribir
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChangeText(localValue);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localValue]);

  // Sincronizar con prop externa si cambia
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={setLocalValue}
        value={localValue}
        style={styles.searchbar}
        iconColor={theme.colors.onSurfaceVariant}
        placeholderTextColor={theme.colors.onSurfaceVariant}
        elevation={0}
      />
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 8,
      backgroundColor: theme.colors.background,
    },
    searchbar: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      elevation: 0,
    },
  });
