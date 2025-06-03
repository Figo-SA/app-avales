import { forwardRef } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { ButtonProps, Button as ButtonR } from "react-native-paper";

interface Props extends ButtonProps {
  children: string;
  style?: StyleProp<ViewStyle>;
  icon?: string;
  iconPosition?: "left" | "right"; // Nueva prop para posición del icono
  borderRadius?: number;
  loading?: boolean;
  disabled?: boolean;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
}

const ThemedButton = (
  {
    children,
    icon,
    iconPosition = "left", // Por defecto a la izquierda
    borderRadius = 30,
    loading,
    disabled,
    mode = "contained",
    style,
    contentStyle,
    ...rest
  }: Props,
  ref: any
) => {
  const buttonStyles = [{ paddingVertical: 2, borderRadius }, style];

  // Configurar la dirección del contenido según la posición del icono
  const buttonContentStyle = [
    {
      flexDirection: iconPosition === "right" ? "row-reverse" : "row",
    },
    contentStyle,
  ];

  return (
    <ButtonR
      ref={ref}
      icon={icon}
      mode={mode}
      style={buttonStyles as any}
      contentStyle={buttonContentStyle as any}
      loading={loading}
      disabled={disabled}
      {...rest}
    >
      {children}
    </ButtonR>
  );
};

export const ThemeButton = forwardRef(ThemedButton);
