"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { type ThemePalette } from "@/constants/siteCustomization";

type Theme = "dark" | "light";
type ThemeContextValue = {
  theme: Theme;
  palette: ThemePalette;
  toggleTheme: () => void;
  setPalette: (palette: ThemePalette) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  palette: "graphite",
  toggleTheme: () => {},
  setPalette: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const applyThemeSettings = (theme: Theme, palette: ThemePalette) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.setAttribute("data-palette", palette);
};

export default function ThemeProvider({
  children,
  defaultTheme = "dark",
  defaultPalette = "graphite",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultPalette?: ThemePalette;
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [palette, setPaletteState] = useState<ThemePalette>(defaultPalette);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("portfolio-theme") as Theme | null;
    const nextTheme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : defaultTheme;

    setTheme(nextTheme);
    setPaletteState(defaultPalette);
    applyThemeSettings(nextTheme, defaultPalette);
  }, [defaultPalette, defaultTheme]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
    applyThemeSettings(next, palette);
  };

  const setPalette = (nextPalette: ThemePalette) => {
    setPaletteState(nextPalette);
    applyThemeSettings(theme, nextPalette);
  };

  if (!mounted) return <>{children}</>;

  return (
    <ThemeContext.Provider value={{ theme, palette, toggleTheme, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
}
