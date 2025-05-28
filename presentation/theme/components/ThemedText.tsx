import { StyleSheet, Text, useColorScheme, type TextProps } from "react-native";
import { useTheme } from "react-native-paper";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "error"
    | "small"
    | "smallSemiBold";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  const color =
    colorScheme === "dark" && darkColor
      ? darkColor
      : colorScheme === "light" && lightColor
      ? lightColor
      : theme.colors.onBackground;

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "error"
          ? { color: theme.colors.error, fontSize: 14, lineHeight: 20 }
          : undefined,
        type === "small" ? { fontSize: 13, lineHeight: 16 } : undefined,
        type === "smallSemiBold"
          ? { fontSize: 12, lineHeight: 16, fontWeight: "600" }
          : undefined,

        type === "link"
          ? { ...styles.link, color: theme.colors.primary }
          : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
    fontFamily: "KanitBold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    // color se define dinámicamente arriba
  },
});
