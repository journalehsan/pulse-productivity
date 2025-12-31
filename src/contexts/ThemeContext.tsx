import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

// Theme types
export type ThemeMode = 'light' | 'dark';
export type ThemePreset = 'default' | 'dracula';

export interface ThemeState {
  mode: ThemeMode;
  accent: string;
  preset: ThemePreset;
}

interface ThemeContextValue {
  theme: ThemeState;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setAccent: (hex: string) => void;
  setPreset: (preset: ThemePreset) => void;
  resetTheme: () => void;
}

const STORAGE_KEY = 'pulse_theme';

const DEFAULT_THEME: ThemeState = {
  mode: 'light',
  accent: '#6D28D9',
  preset: 'default',
};

// Convert hex to HSL values (returns "H S% L%" format for CSS)
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Generate a lighter/darker variant of the accent
function adjustLightness(hsl: { h: number; s: number; l: number }, amount: number) {
  return {
    h: hsl.h,
    s: hsl.s,
    l: Math.max(0, Math.min(100, hsl.l + amount)),
  };
}

// Apply theme to DOM
function applyThemeToDOM(theme: ThemeState) {
  const root = document.documentElement;
  
  // Set data attributes
  root.setAttribute('data-theme', theme.mode);
  root.setAttribute('data-preset', theme.preset);
  
  // Apply dark class for Tailwind
  if (theme.mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Convert accent to HSL
  const accentHSL = hexToHSL(theme.accent);
  const accentLight = adjustLightness(accentHSL, 15);
  const accentDark = adjustLightness(accentHSL, -15);
  
  // Set accent colors as CSS variables
  root.style.setProperty('--primary', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  root.style.setProperty('--ring', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  root.style.setProperty('--sidebar-primary', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  root.style.setProperty('--sidebar-ring', `${accentHSL.h} ${accentHSL.s}% ${accentHSL.l}%`);
  
  // Adjust foreground based on accent lightness
  if (theme.mode === 'dark') {
    root.style.setProperty('--primary-foreground', `${accentHSL.h} 80% 15%`);
    root.style.setProperty('--sidebar-primary-foreground', `${accentHSL.h} 80% 15%`);
  } else {
    root.style.setProperty('--primary-foreground', `${accentHSL.h} 100% 97%`);
    root.style.setProperty('--sidebar-primary-foreground', `${accentHSL.h} 100% 97%`);
  }
  
  // Apply Dracula preset overrides (only in dark mode)
  if (theme.mode === 'dark' && theme.preset === 'dracula') {
    // Dracula palette
    root.style.setProperty('--background', '231 15% 18%'); // #282A36
    root.style.setProperty('--foreground', '60 30% 96%'); // #F8F8F2
    root.style.setProperty('--card', '232 14% 22%'); // #2F3142
    root.style.setProperty('--card-foreground', '60 30% 96%');
    root.style.setProperty('--popover', '233 14% 24%'); // #343746
    root.style.setProperty('--popover-foreground', '60 30% 96%');
    root.style.setProperty('--muted', '232 10% 28%');
    root.style.setProperty('--muted-foreground', '60 10% 75%'); // #BFBFB8
    root.style.setProperty('--border', '232 12% 26%'); // #3B3E52
    root.style.setProperty('--input', '232 12% 26%');
    root.style.setProperty('--destructive', '0 100% 67%'); // #FF5555
    root.style.setProperty('--sidebar-background', '231 15% 18%');
    root.style.setProperty('--sidebar-foreground', '60 30% 96%');
    root.style.setProperty('--sidebar-border', '232 12% 26%');
    root.style.setProperty('--sidebar', '232 14% 22%');
  } else if (theme.mode === 'dark') {
    // Reset to default dark values
    root.style.setProperty('--background', '222 47% 11%');
    root.style.setProperty('--foreground', '210 40% 98%');
    root.style.setProperty('--card', '217 32% 17%');
    root.style.setProperty('--card-foreground', '210 40% 98%');
    root.style.setProperty('--popover', '215 24% 26%');
    root.style.setProperty('--popover-foreground', '210 40% 98%');
    root.style.setProperty('--muted', '215 16% 46%');
    root.style.setProperty('--muted-foreground', '210 40% 98%');
    root.style.setProperty('--border', '215 19% 34%');
    root.style.setProperty('--input', '215 19% 34%');
    root.style.setProperty('--destructive', '0 84% 60%');
    root.style.setProperty('--sidebar-background', '240 5.9% 10%');
    root.style.setProperty('--sidebar-foreground', '210 40% 98%');
    root.style.setProperty('--sidebar-border', '215 19% 34%');
    root.style.setProperty('--sidebar', '217 32% 17%');
  } else {
    // Reset to default light values
    root.style.setProperty('--background', '209 40% 96%');
    root.style.setProperty('--foreground', '222 47% 11%');
    root.style.setProperty('--card', '210 40% 98%');
    root.style.setProperty('--card-foreground', '222 47% 11%');
    root.style.setProperty('--popover', '214 31% 91%');
    root.style.setProperty('--popover-foreground', '222 47% 11%');
    root.style.setProperty('--muted', '215 20% 65%');
    root.style.setProperty('--muted-foreground', '222 47% 11%');
    root.style.setProperty('--border', '212 26% 83%');
    root.style.setProperty('--input', '212 26% 83%');
    root.style.setProperty('--destructive', '0 72% 50%');
    root.style.setProperty('--sidebar-background', '0 0% 98%');
    root.style.setProperty('--sidebar-foreground', '222 47% 11%');
    root.style.setProperty('--sidebar-border', '212 26% 83%');
    root.style.setProperty('--sidebar', '210 40% 98%');
  }
}

// Load theme from localStorage
function loadTheme(): ThemeState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_THEME, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load theme:', e);
  }
  return DEFAULT_THEME;
}

// Save theme to localStorage
function saveTheme(theme: ThemeState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeState>(loadTheme);

  // Apply theme on mount and changes
  useEffect(() => {
    applyThemeToDOM(theme);
    saveTheme(theme);
  }, [theme]);

  const setMode = useCallback((mode: ThemeMode) => {
    setTheme(prev => ({ ...prev, mode }));
  }, []);

  const toggleMode = useCallback(() => {
    setTheme(prev => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }));
  }, []);

  const setAccent = useCallback((accent: string) => {
    setTheme(prev => ({ ...prev, accent }));
  }, []);

  const setPreset = useCallback((preset: ThemePreset) => {
    setTheme(prev => ({ ...prev, preset }));
  }, []);

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setMode, toggleMode, setAccent, setPreset, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
