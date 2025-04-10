import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Create the context
const ThemeContext = createContext();

// 2. Export the custom hook for convenience
export const useTheme = () => useContext(ThemeContext);

// 3. ThemeProvider component
const ThemeProvider = ({ children }) => {
  // Check localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // Apply theme to <body> and save in localStorage whenever theme changes
  useEffect(() => {
    document.body.setAttribute("data-theme", theme); // optional for CSS theming
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between 'light' and 'dark'
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Provide the theme and toggle function to children
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
