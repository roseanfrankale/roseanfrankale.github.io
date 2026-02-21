import { useContext } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { designTokens } from "@/constants/designTokens";
import { Colors } from "@/constants/theme";

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    // Fallback for backward compatibility
    return {
      theme: Colors.dark,
      colors: Colors.dark,
      isDark: true,
      skin: "historian" as const,
      setSkin: () => {},
      setColorMode: () => {},
      spacing: designTokens.spacing,
      radius: designTokens.radius,
      fonts: designTokens.typography.fonts.historian,
      shadows: designTokens.shadows.historian,
    };
  }

  const { skin, colorMode, systemColorScheme, setSkin, setColorMode } = context;

  // Determine actual color mode (handle 'system' option)
  const actualColorMode: "light" | "dark" =
    colorMode === "system" ? systemColorScheme : colorMode;

  const isDark = actualColorMode === "dark";

  // Get colors from new design tokens
  const designColors = designTokens.colors[skin][actualColorMode];

  // Get colors from old theme system for backward compatibility
  const legacyColors = Colors[actualColorMode];

  // Merge colors for backward compatibility
  const colors = {
    ...legacyColors,
    ...designColors,
    success: designTokens.colors.semantic.success,
    error: designTokens.colors.semantic.error,
    warning: designTokens.colors.semantic.warning,
    info: designTokens.colors.semantic.info,
  };

  // Get fonts for current theme
  const fonts = designTokens.typography.fonts[skin];

  // Get glass morphism styles
  const glass = designTokens.glass[skin][actualColorMode];

  return {
    // Legacy properties
    theme: colors,
    isDark,

    // New design tokens
    skin,
    colorMode: actualColorMode,
    colors,
    fonts,
    spacing: designTokens.spacing,
    radius: designTokens.radius,
    shadows: designTokens.shadows[skin],
    glass,
    fontSizes: designTokens.typography.sizes,

    // Methods
    setSkin,
    setColorMode,
  };
}
