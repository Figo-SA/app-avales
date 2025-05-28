import { Link, LinkProps } from "expo-router";
import { useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";

export type ThemedLinkProps = LinkProps & {
  lightColor?: string;
  darkColor?: string;
};

const ThemedLink = ({
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedLinkProps) => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  // Lógica de color: personalizado > tema
  const color =
    colorScheme === "dark" && darkColor
      ? darkColor
      : colorScheme === "light" && lightColor
      ? lightColor
      : theme.colors.primary;

  return (
    <Link
      style={[
        {
          color,

          lineHeight: 24,
        },
        style,
      ]}
      {...rest}
    />
  );
};

export default ThemedLink;
