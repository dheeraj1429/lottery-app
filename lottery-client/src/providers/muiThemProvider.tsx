'use client';

import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';

const muiTheme = createTheme({
   palette: {
      mode: 'dark',
      success: {
         main: '#3bc117',
      },
   },
});

const MuiThemProvider = function ({ children }: { children: React.ReactNode }) {
   return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>;
};

export default MuiThemProvider;
