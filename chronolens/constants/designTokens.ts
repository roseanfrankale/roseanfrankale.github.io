// Design Tokens - Complete Design System for ChronoLens

export type ThemeSkin = "historian" | "cyberpunk";
export type ColorMode = "light" | "dark" | "system";

// ===== COLORS =====
const historianColors = {
  light: {
    text: "#1C140C",
    textSecondary: "#1A1A1A",
    background: "#F4E6D5",
    backgroundSecondary: "#F2F0E4",
    backgroundTertiary: "#D4C4A8",
    card: "#FFFFFF",
    cardAlt: "#D4C4A8",
    border: "rgba(28, 20, 12, 0.1)",
    accent: "#C9A063",
    accentSecondary: "#8B7355",
  },
  dark: {
    text: "#FAFAFA",
    textSecondary: "#D1D1D1",
    background: "#1A1816",
    backgroundSecondary: "#1A1917",
    backgroundTertiary: "#2A2520",
    card: "#1C1C1C",
    cardAlt: "#2A2520",
    border: "#3A3A3A",
    accent: "#C9A876",
    accentSecondary: "#8B7355",
  },
};

const cyberpunkColors = {
  light: {
    text: "#0A0A0A",
    textSecondary: "#1A1A1A",
    background: "#FAFAFA",
    backgroundSecondary: "#F5F5F5",
    backgroundTertiary: "#F0F0F0",
    card: "#FFFFFF",
    cardAlt: "#F0F0F0",
    border: "#99D9D9",
    accent: "#00F0FF",
    accentSecondary: "#FF00FF",
  },
  dark: {
    text: "#DDEFEF",
    textSecondary: "#B4CCCC",
    background: "#050505",
    backgroundSecondary: "#0A0A0A",
    backgroundTertiary: "#151515",
    card: "#0D0D0D",
    cardAlt: "#151515",
    border: "#1A4D4D",
    accent: "#00F0FF",
    accentSecondary: "#FF00FF",
  },
};

const semanticColors = {
  success: "#22C55E",
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
    body: "SpaceMono-Regular",
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
      background: "rgba(244, 230, 213, 0.7)",
      border: "rgba(28, 20, 12, 0.1)",
      blur: 10,
    },
    dark: {
      background: "rgba(26, 24, 22, 0.7)",
      border: "rgba(255, 255, 255, 0.1)",
      blur: 10,
    },
  },
  cyberpunk: {
    light: {
      background: "rgba(250, 250, 250, 0.8)",
      border: "rgba(0, 240, 255, 0.2)",
      blur: 16,
    },
    dark: {
      background: "rgba(13, 13, 13, 0.8)",
      border: "rgba(0, 240, 255, 0.2)",
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
