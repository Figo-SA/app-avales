import { forwardRef } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { ButtonProps, Button as ButtonR } from "react-native-paper";

interface Props extends ButtonProps {
  children: string;
  style?: StyleProp<ViewStyle>;
  icon?: string;
  borderRadius?: number;
  loading: boolean;
  disabled: boolean;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
}

const ThemedButton = (
  {
    children,
    icon,
    borderRadius = 30,
    loading,
    disabled,
    mode = "contained",
    style,
    ...rest
  }: Props,
  ref: any
) => {
  const buttonStyles = [{ paddingVertical: 2, borderRadius }, style];

  return (
    <ButtonR
      ref={ref}
      icon={icon}
      mode={mode}
      style={buttonStyles as any}
      loading={loading}
      disabled={disabled}
      {...rest}
    >
      {children}
    </ButtonR>
  );
};

export const ThemeButton = forwardRef(ThemedButton);
