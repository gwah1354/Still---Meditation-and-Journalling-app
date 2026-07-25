import { createContext, useContext, useEffect, type ReactNode } from "react";

interface ThemeContextType {
  isDark: true;
}

const ThemeContext = createContext<ThemeContextType>({ isDark: true });

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark: true }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
