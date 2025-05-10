import { createTheme } from '@mui/material/styles';

const mainTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#2287E7' },
        secondary: { main: '#f5f5f5' },
        background: { default: '#F5F5F5', paper: '#f5f5f5' },
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0C0C0C',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#F5F5F5',
        },
      },
    },
  },
});

export default mainTheme;
