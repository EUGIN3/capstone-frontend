import { createTheme } from '@mui/material/styles';

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#0C0C0C' },
        background: { default: '#F5F5F5', paper: '#FFFFFF' },
        text: { primary: '#0C0C0C' },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#F5F5F5' },
        background: { default: '#0C0C0C', paper: '#1A1A1A' },
        text: { primary: '#F5F5F5' },
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

export default demoTheme;