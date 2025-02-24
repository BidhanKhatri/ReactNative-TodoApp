import { createContext, useState, useEffect } from "react";
import Colors from "../constants/Colors";
import { Appearance } from "react-native";

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }) => {
  // Store user-selected theme mode (default: system preference)
  const [colorScheme, setColorScheme] = useState(
    Appearance.getColorScheme() || "light"
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme || "light");
    });

    return () => subscription.remove();
  }, []);

  // Toggle Theme Mode (manual switch)
  const toggleTheme = () => {
    setColorScheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
