import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Icon, useTheme } from "react-native-paper";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Buscar...",
}: SearchBarProps) => {
  const theme = useTheme();
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChangeText(localValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [localValue]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: theme.colors.surfaceVariant,
            borderColor: isFocused ? theme.colors.primary : "transparent",
          },
        ]}
      >
        <Icon
          source="ion:search-outline"
          size={20}
          color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant}
        />
        <TextInput
          placeholder={placeholder}
          onChangeText={setLocalValue}
          value={localValue}
          style={[styles.input, { color: theme.colors.onSurface }]}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {localValue.length > 0 && (
          <Pressable onPress={() => setLocalValue("")}>
            <Icon
              source="ion:close-circle"
              size={20}
              color={theme.colors.onSurfaceVariant}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    padding: 0,
  },
});
