import React, { createContext, useContext } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { defaultTheme, Theme } from '../../styles/theme';

// Create theme context
const ThemeContext = createContext<Theme>(defaultTheme);

// Theme provider component
export const AppThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <EmotionThemeProvider theme={defaultTheme}>
      <ThemeContext.Provider value={defaultTheme}>
        {children}
      </ThemeContext.Provider>
    </EmotionThemeProvider>
  );
};

// Custom hook to access theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within an AppThemeProvider');
  }
  return context;
};