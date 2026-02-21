import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useContext } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const theme = Colors[colorScheme ?? "dark"];

  // Try to get theme context for skin/theme switching, otherwise return default
  const themeContext = useContext(ThemeContext);
  const themeContextAvailable = themeContext !== undefined;

  // For backward compatibility, alias theme as 'colors'
  const colors = theme;
  const skin = themeContext?.skin ?? "historian";
  const setSkin = themeContext?.setSkin ?? (() => {});

  return {
    theme,
    isDark,
    colors,
    skin,
    setSkin,
  };
}
