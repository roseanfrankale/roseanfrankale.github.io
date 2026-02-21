import { withSpring, withTiming, Easing } from "react-native-reanimated";

export const springConfig = {
  historian: { damping: 15, stiffness: 150 },
  cyberpunk: { damping: 8, stiffness: 250 },
};

export const timingConfig = {
  historian: { duration: 600, easing: Easing.out(Easing.cubic) },
  cyberpunk: { duration: 250, easing: Easing.inOut(Easing.ease) },
};

export const createSpring =
  (theme: "historian" | "cyberpunk") => (value: number) =>
    withSpring(value, springConfig[theme]);

export const createTiming =
  (theme: "historian" | "cyberpunk") => (value: number) =>
    withTiming(value, timingConfig[theme]);

// Preset animations for common use cases
export const fadeIn = (theme: "historian" | "cyberpunk") =>
  withTiming(1, timingConfig[theme]);

export const fadeOut = (theme: "historian" | "cyberpunk") =>
  withTiming(0, timingConfig[theme]);

export const slideInUp = (theme: "historian" | "cyberpunk") =>
  withTiming(0, timingConfig[theme]);

export const scaleIn = (theme: "historian" | "cyberpunk") =>
  withSpring(1, springConfig[theme]);

export const scaleOut = (theme: "historian" | "cyberpunk") =>
  withSpring(0, springConfig[theme]);

// Pressable feedback configs
export const pressableConfig = {
  historian: {
    scaleDown: 0.95,
    damping: 15,
    stiffness: 200,
  },
  cyberpunk: {
    scaleDown: 0.92,
    damping: 10,
    stiffness: 300,
  },
};
