// Design Tokens - Complete Design System for ChronoLens

export type ThemeSkin = "historian" | "cyberpunk";
export type ColorMode = "light" | "dark" | "system";

// ===== COLORS =====
const historianColors = {
  light: {
    text: "#1C140C",
    textSecondary: "#8B7355",
    background: "#FAFAF8",
    backgroundSecondary: "#F4E6D5",
    backgroundTertiary: "#EBD8C3",
    card: "#FFFFFF",
    cardAlt: "#F4E6D5",
    border: "#D4C4B0",
    accent: "#D4AF37",
    accentSecondary: "#B8956A",
  },
  dark: {
    text: "#F4E6D5",
    textSecondary: "#B8A08A",
    background: "#1C140C",
    backgroundSecondary: "#2A1F15",
    backgroundTertiary: "#3A2D1F",
    card: "#2A1F15",
    cardAlt: "#3A2D1F",
    border: "#4A3829",
    accent: "#E5C158",
    accentSecondary: "#C9A753",
  },
};

const cyberpunkColors = {
  light: {
    text: "#0A0E14",
    textSecondary: "#5C6773",
    background: "#F0F4FA",
    backgroundSecondary: "#E6ECF5",
    backgroundTertiary: "#D9E2ED",
    card: "#FFFFFF",
    cardAlt: "#E6ECF5",
    border: "#C5D1E0",
    accent: "#00E0FF",
    accentSecondary: "#7B61FF",
  },
  dark: {
    text: "#E6F1FF",
    textSecondary: "#8BA3C7",
    background: "#0A0E14",
    backgroundSecondary: "#141A24",
    backgroundTertiary: "#1F2937",
    card: "#141A24",
    cardAlt: "#1F2937",
    border: "#2D3748",
    accent: "#00F0FF",
    accentSecondary: "#9D7FFF",
  },
};

const semanticColors = {
  success: "#10B981",
  error: "#EF4444",
  warning: "#F59E0B",
  info: "#3B82F6",
};

// ===== TYPOGRAPHY =====
const fonts = {
  historian: {
    header: "Cinzel-Regular",
    body: "System",
    mono: "JetBrainsMono-Regular",
  },
  cyberpunk: {
    header: "SpaceMono-Regular",
    body: "System",
    mono: "JetBrainsMono-Regular",
  },
};

const fontSizes = {
  h1: { size: 32, lineHeight: 1.2, letterSpacing: 0.5 },
  h2: { size: 28, lineHeight: 1.25, letterSpacing: 0.5 },
  h3: { size: 24, lineHeight: 1.3, letterSpacing: 0 },
  h4: { size: 20, lineHeight: 1.4, letterSpacing: 0 },
  body: { size: 16, lineHeight: 1.5, letterSpacing: 0 },
  small: { size: 14, lineHeight: 1.5, letterSpacing: 0 },
  caption: { size: 12, lineHeight: 1.4, letterSpacing: 1.5 },
  captionMono: { size: 10, lineHeight: 1.4, letterSpacing: 1 },
};

// ===== SPACING =====
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
};

// ===== BORDER RADIUS =====
const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
};

// ===== SHADOWS =====
const shadows = {
  historian: {
    sm: {
      shadowColor: "#1C140C",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: "#1C140C",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: "#1C140C",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },
    glow: {
      color: "#D4AF37",
    },
  },
  cyberpunk: {
    sm: {
      shadowColor: "#00E0FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#00E0FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: "#00E0FF",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 6,
    },
    glow: {
      color: "#00F0FF",
    },
  },
};

// ===== GLASS MORPHISM =====
const glass = {
  historian: {
    light: {
      background: "rgba(255, 255, 255, 0.1)",
      border: "rgba(212, 175, 55, 0.2)",
      blur: 10,
    },
    dark: {
      background: "rgba(42, 31, 21, 0.2)",
      border: "rgba(229, 193, 88, 0.3)",
      blur: 12,
    },
  },
  cyberpunk: {
    light: {
      background: "rgba(255, 255, 255, 0.05)",
      border: "rgba(0, 224, 255, 0.3)",
      blur: 16,
    },
    dark: {
      background: "rgba(20, 26, 36, 0.2)",
      border: "rgba(0, 240, 255, 0.4)",
      blur: 20,
    },
  },
};

// ===== EXPORT =====
export const designTokens = {
  colors: {
    historian: historianColors,
    cyberpunk: cyberpunkColors,
    semantic: semanticColors,
  },
  typography: {
    fonts,
    sizes: fontSizes,
  },
  spacing,
  radius,
  shadows,
  glass,
};
