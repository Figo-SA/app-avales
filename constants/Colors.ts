export const Colors = {
  light: {
    primary: "rgb(211, 47, 47)", // Rojo vibrante
    onPrimary: "rgb(255, 255, 255)", // Blanco
    primaryContainer: "rgb(255, 205, 205)", // Rojo claro
    onPrimaryContainer: "rgb(80, 0, 0)", // Rojo oscuro
    secondary: "rgb(255, 202, 40)", // Amarillo vibrante
    onSecondary: "rgb(0, 0, 0)", // Negro
    secondaryContainer: "rgb(255, 230, 180)", // Amarillo claro
    onSecondaryContainer: "rgb(80, 60, 0)", // Amarillo oscuro
    tertiary: "rgb(50, 50, 50)", // Negro/gris oscuro
    onTertiary: "rgb(255, 255, 255)", // Blanco ← DESCOMENTA ESTA LÍNEA
    tertiaryContainer: "rgb(220, 220, 220)", // Gris claro
    onTertiaryContainer: "rgb(30, 30, 30)", // Gris muy oscuro
    error: "rgb(186, 26, 26)", // Rojo error
    onError: "rgb(255, 255, 255)", // Blanco
    errorContainer: "rgb(255, 218, 214)", // Rojo claro
    onErrorContainer: "rgb(65, 0, 2)", // Rojo oscuro
    background: "rgb(255, 255, 255)", // Blanco puro
    onBackground: "rgb(0, 0, 0)", // Negro puro
    surface: "rgb(250, 250, 250)", // Blanco ligeramente cálido
    onSurface: "rgb(0, 0, 0)", // Negro
    surfaceVariant: "rgb(240, 240, 240)", // Gris muy claro
    onSurfaceVariant: "rgb(70, 70, 70)", // Gris medio
    outline: "rgb(180, 180, 180)", // Gris claro
    outlineVariant: "rgb(220, 220, 220)", // Gris muy claro
    shadow: "rgb(0, 0, 0)", // Negro puro
    scrim: "rgb(0, 0, 0)", // Negro puro
    inverseSurface: "rgb(50, 50, 50)", // Gris oscuro
    inverseOnSurface: "rgb(255, 255, 255)", // Blanco
    inversePrimary: "rgb(255, 180, 180)", // Rojo claro

    elevation: {
      level0: "transparent",
      level1: "rgb(245, 245, 245)",
      level2: "rgb(235, 235, 235)",
      level3: "rgb(225, 225, 225)",
      level4: "rgb(215, 215, 215)",
      level5: "rgb(200, 200, 200)",
    },
    surfaceDisabled: "rgba(0, 0, 0, 0.12)", // Basado en onSurface: negro
    onSurfaceDisabled: "rgba(0, 0, 0, 0.38)", // Basado en onSurface: negro
    backdrop: "rgba(0, 0, 0, 0.4)", // Sombra neutra basada en shadow/scrim
  },
  dark: {
    primary: "rgb(230, 70, 70)", // Rojo más vibrante
    onPrimary: "rgb(255, 255, 255)", // Blanco
    primaryContainer: "rgb(150, 40, 40)", // Rojo oscuro
    onPrimaryContainer: "rgb(255, 200, 200)", // Rojo claro
    secondary: "rgb(255, 215, 80)", // Amarillo más vibrante
    onSecondary: "rgb(0, 0, 0)", // Negro
    secondaryContainer: "rgb(150, 120, 30)", // Amarillo oscuro
    onSecondaryContainer: "rgb(255, 230, 180)", // Amarillo claro
    tertiary: "rgb(30, 30, 30)", // Negro/gris muy oscuro
    onTertiary: "rgb(255, 255, 255)", // Blanco ← YA ESTÁ DESCOMENTADO
    tertiaryContainer: "rgb(70, 70, 70)", // Gris oscuro
    onTertiaryContainer: "rgb(220, 220, 220)", // Gris claro
    error: "rgb(255, 140, 130)", // Rojo error claro
    onError: "rgb(80, 0, 0)", // Rojo oscuro
    errorContainer: "rgb(120, 0, 10)", // Rojo error oscuro
    onErrorContainer: "rgb(255, 200, 195)", // Rojo error muy claro
    background: "rgb(20, 20, 20)", // Negro/gris muy oscuro
    onBackground: "rgb(240, 240, 240)", // Gris muy claro
    surface: "rgb(30, 30, 30)", // Gris oscuro
    onSurface: "rgb(240, 240, 240)", // Gris muy claro
    surfaceVariant: "rgb(50, 50, 50)", // Gris medio
    onSurfaceVariant: "rgb(200, 200, 200)", // Gris claro
    outline: "rgb(100, 100, 100)", // Gris medio
    outlineVariant: "rgb(70, 70, 70)", // Gris medio oscuro
    shadow: "rgb(0, 0, 0)", // Negro puro
    scrim: "rgb(0, 0, 0)", // Negro puro
    inverseSurface: "rgb(240, 240, 240)", // Gris muy claro
    inverseOnSurface: "rgb(50, 50, 50)", // Gris oscuro
    inversePrimary: "rgb(150, 40, 40)", // Rojo oscuro
    elevation: {
      level0: "transparent",
      level1: "rgb(40, 40, 40)",
      level2: "rgb(50, 50, 50)",
      level3: "rgb(60, 60, 60)",
      level4: "rgb(70, 70, 70)",
      level5: "rgb(80, 80, 80)",
    },
    surfaceDisabled: "rgba(255, 255, 255, 0.12)", // onSurface con opacidad
    onSurfaceDisabled: "rgba(255, 255, 255, 0.38)", // onSurface con mayor opacidad
    backdrop: "rgba(255, 255, 255, 0.4)", // sombra clara sobre fondo oscuro
  },
};
