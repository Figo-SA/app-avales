import { useColorScheme } from "react-native";
import { useTheme } from "react-native-paper";

export const useAppTheme = () => {
  const theme = useTheme();
  const colorScheme = useColorScheme();

  return {
    theme,
    isDark: colorScheme === "dark",
    colors: theme.colors,
  };
};
