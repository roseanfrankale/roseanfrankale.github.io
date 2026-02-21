import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeSkin, ColorMode } from "../constants/designTokens";

interface ThemeContextType {
  skin: ThemeSkin;
  colorMode: ColorMode;
  systemColorScheme: "light" | "dark";
  setSkin: (skin: ThemeSkin) => void;
  setColorMode: (mode: ColorMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme() || "light";
  const [skin, setSkinState] = useState<ThemeSkin>("historian");
  const [colorMode, setColorModeState] = useState<ColorMode>("system");

  // Load saved theme on mount
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedSkin = await AsyncStorage.getItem("themeSkin");
      const savedColorMode = await AsyncStorage.getItem("colorMode");

      if (savedSkin) setSkinState(savedSkin as ThemeSkin);
      if (savedColorMode) setColorModeState(savedColorMode as ColorMode);
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const setSkin = async (newSkin: ThemeSkin) => {
    setSkinState(newSkin);
    try {
      await AsyncStorage.setItem("themeSkin", newSkin);
    } catch (error) {
      console.error("Error saving skin:", error);
    }
  };

  const setColorMode = async (newMode: ColorMode) => {
    setColorModeState(newMode);
    try {
      await AsyncStorage.setItem("colorMode", newMode);
    } catch (error) {
      console.error("Error saving color mode:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        skin,
        colorMode,
        systemColorScheme,
        setSkin,
        setColorMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeSkin() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeSkin must be used within a ThemeProvider");
  }
  return context;
}
