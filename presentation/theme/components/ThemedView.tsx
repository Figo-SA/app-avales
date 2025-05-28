import { View, type ViewProps } from "react-native";
import { useTheme } from "react-native-paper";

export type ThemedViewProps = ViewProps & {
  backgroundVariant?: "background" | "surface" | "surfaceVariant" | "elevation";
  elevationLevel?:
    | "level0"
    | "level1"
    | "level2"
    | "level3"
    | "level4"
    | "level5";
};

export function ThemedView({
  style,
  backgroundVariant = "background",
  elevationLevel = "level0",
  ...otherProps
}: ThemedViewProps) {
  const theme = useTheme();

  let backgroundColor: string | undefined;

  if (backgroundVariant === "elevation") {
    // Verifica si elevation existe y usa el nivel especificado, con fallback a background
    backgroundColor =
      theme.colors.elevation && elevationLevel in theme.colors.elevation
        ? theme.colors.elevation[elevationLevel]
        : theme.colors.background;
  } else {
    backgroundColor =
      theme.colors[backgroundVariant] ?? theme.colors.background;
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
