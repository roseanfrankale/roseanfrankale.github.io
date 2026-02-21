import React, { createContext, useContext, useState, ReactNode } from "react";

export type ThemeSkin = "historian" | "cyberpunk";

interface ThemeContextType {
  skin: ThemeSkin;
  setSkin: (skin: ThemeSkin) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [skin, setSkin] = useState<ThemeSkin>("dark historian");

  return (
    <ThemeContext.Provider value={{ skin, setSkin }}>
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
