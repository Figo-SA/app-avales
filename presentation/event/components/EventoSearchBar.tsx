import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";

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
  const [isFocused, setIsFocused] = useState(false);

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
      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <Icon
          source="ion:search-outline"
          size={20}
          color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant}
        />
        <TextInput
          placeholder={placeholder}
          onChangeText={setLocalValue}
          value={localValue}
          style={styles.input}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {localValue.length > 0 && (
          <Icon
            source="ion:close-circle"
            size={20}
            color={theme.colors.onSurfaceVariant}
          />
        )}
      </View>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 4,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      gap: 10,
      borderWidth: 2,
      borderColor: "transparent",
    },
    searchContainerFocused: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.surface,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: theme.colors.onSurface,
      fontWeight: "500",
      padding: 0,
    },
  });
