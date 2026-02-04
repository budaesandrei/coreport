import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from '@theme/theme';

export type ThemeModePreference = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';

type ThemeContextType = {
  preference: ThemeModePreference;
  resolvedMode: ResolvedThemeMode;
  setPreference: (mode: ThemeModePreference) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  preference: 'system',
  resolvedMode: 'light',
  setPreference: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

const THEME_STORAGE_KEY = 'coreport-theme-mode';

function getSystemMode(): ResolvedThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialPreference(): ThemeModePreference {
  if (typeof window === 'undefined') return 'system';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    // ignore
  }
  return 'system';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = useState<ThemeModePreference>(getInitialPreference);
  const [systemMode, setSystemMode] = useState<ResolvedThemeMode>(getSystemMode);

  // Persist preference changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // ignore
    }
  }, [preference]);

  // Track system mode changes (only matters when preference is 'system', but cheap either way).
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const update = () => setSystemMode(media.matches ? 'dark' : 'light');
    update();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }

    // Safari < 14
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  const resolvedMode: ResolvedThemeMode = preference === 'system' ? systemMode : preference;

  const theme = useMemo(() => (resolvedMode === 'dark' ? darkTheme : lightTheme), [resolvedMode]);

  const setPreference = (mode: ThemeModePreference) => setPreferenceState(mode);

  return (
    <ThemeContext.Provider value={{ preference, resolvedMode, setPreference }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
