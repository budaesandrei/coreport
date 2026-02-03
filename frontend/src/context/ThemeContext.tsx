import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from '@theme/theme';

type ThemeContextType = {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

const THEME_STORAGE_KEY = 'coreport-theme-mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = (): 'light' | 'dark' => {
    // Check localStorage first
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // If no saved preference, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  const [mode, setMode] = useState<'light' | 'dark'>(getInitialTheme);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 