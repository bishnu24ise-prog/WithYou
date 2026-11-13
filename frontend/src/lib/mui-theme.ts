import { createTheme } from '@mui/material/styles';

export function createBurgundyBeigeTheme(mode: 'light' | 'dark') {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#E0538D' : '#C32F6E',
        contrastText: '#FAF4EC',
      },
      secondary: {
        main: isDark ? '#C0A284' : '#A18265',
        contrastText: '#FAF4EC',
      },
      error: { main: '#C0265D' },
      success: {
        main: isDark ? '#E0538D' : '#74173D',
        contrastText: '#FAF4EC',
      },
      info: { main: isDark ? '#E8D7C3' : '#C0A284' },
      text: {
        primary: isDark ? '#F5EBE1' : '#3D0B20',
        secondary: isDark ? '#E8D7C3' : '#7E634A',
      },
      background: {
        default: 'transparent',
        paper: isDark ? '#240613' : '#FFFDF9',
      },
    },
    typography: {
      fontFamily: 'var(--font-sans), ui-sans-serif, system-ui, Noto Naskh Arabic, sans-serif',
      h5: { fontFamily: 'var(--font-display), Georgia, serif' },
    },
    shape: { borderRadius: 12 },
  });
}
