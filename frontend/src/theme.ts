import { createTheme } from '@mui/material';

export const mainPrimary = '#003056';
export const mainSecondary = '#b61f29';

export const theme = createTheme({
  palette: {
    primary: {
      main: mainPrimary,
    },
    info: {
      main: mainPrimary,
    },
    secondary: {
      main: mainSecondary,
    },
  },
});
