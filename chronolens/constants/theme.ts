import { Platform } from "react-native";

const sepiaLight = "#8B6F47";
const sepiaDark = "#A88B5C";
const accentGold = "#D4AF37";
const accentGoldDark = "#E5C158";

export const Colors = {
  light: {
    text: "#2C2C2C",
    textSecondary: "#6B6B6B",
    buttonText: "#FFFFFF",
    tabIconDefault: "#8B8B8B",
    tabIconSelected: sepiaLight,
    link: sepiaLight,
    accent: accentGold,
    backgroundRoot: "#FAFAF8",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F5F5F2",
    backgroundTertiary: "#EDEDE8",
    border: "#E5E5E0",
    success: "#4CAF50",
    error: "#E53935",
    communityBlue: "#5B9BD5",
    sepia: sepiaLight,
    sepiaLight: "rgba(139, 111, 71, 0.10)",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B7075",
    tabIconSelected: sepiaDark,
    link: sepiaDark,
    accent: accentGoldDark,
    backgroundRoot: "#1A1917",
    backgroundDefault: "#252420",
    backgroundSecondary: "#302E28",
    backgroundTertiary: "#3B3830",
    border: "#3D3B35",
    success: "#66BB6A",
    error: "#EF5350",
    communityBlue: "#64B5F6",
    sepia: sepiaDark,
    sepiaLight: "rgba(168, 139, 92, 0.15)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 17,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: "500" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  float: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
