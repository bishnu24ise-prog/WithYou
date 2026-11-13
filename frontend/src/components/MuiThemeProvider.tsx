'use client';

import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'next-themes';
import { createBurgundyBeigeTheme } from '@/lib/mui-theme';

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const theme = useMemo(
    () => createBurgundyBeigeTheme(resolvedTheme === 'dark' ? 'dark' : 'light'),
    [resolvedTheme]
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
