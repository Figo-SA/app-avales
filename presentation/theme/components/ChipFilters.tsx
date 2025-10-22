import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

export interface ChipFilterOption<T extends string> {
  value: T;
  label: string;
  color?: string;
  count?: number;
}

interface ChipFiltersProps<T extends string> {
  options: ChipFilterOption<T>[];
  selectedValue: T;
  onValueChange: (value: T) => void;
}

/**
 * Componente genérico de chips para filtros
 * Reutilizable en cualquier pantalla que necesite filtros con chips
 * 
 * @example
 * ```tsx
 * <ChipFilters
 *   options={[
 *     { value: 'all', label: 'Todos', count: 10 },
 *     { value: 'active', label: 'Activos', count: 5, color: '#4CAF50' }
 *   ]}
 *   selectedValue={selected}
 *   onValueChange={setSelected}
 * />
 * ```
 */
export function ChipFilters<T extends string>({
  options,
  selectedValue,
  onValueChange,
}: ChipFiltersProps<T>) {
  const theme = useTheme();

  const getChipStyles = (option: ChipFilterOption<T>) => {
    const isSelected = selectedValue === option.value;
    const chipColor = option.color || theme.colors.primary;

    return {
      containerStyle: [
        styles.chip,
        isSelected && {
          backgroundColor: `${chipColor}15`, // 15% opacity
          borderColor: chipColor,
        },
      ],
      textStyle: [
        styles.chipText,
        isSelected && { color: chipColor },
      ],
    };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const { containerStyle, textStyle } = getChipStyles(option);

          return (
            <Chip
              key={option.value}
              compact
              selected={selectedValue === option.value}
              onPress={() => onValueChange(option.value)}
              mode="outlined"
              style={containerStyle}
              textStyle={textStyle}
            >
              {option.label}
              {option.count !== undefined && option.count > 0 && ` (${option.count})`}
            </Chip>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollContent: {
    gap: 8,
    alignItems: "center",
  },
  chip: {
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
