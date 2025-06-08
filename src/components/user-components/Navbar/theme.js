import { createTheme } from '@mui/material/styles';

const mainTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: {
    light: {
      palette: {
        mode: 'light', // Only mode 'light'.
        primary: { 
          main: '#0C0C0C' // Main color for text, sidebar (navigation bar) text color when selected. 
        }, 
        background: { 
          default: '#F5F5F5', // Background color of the app pages.
          paper: '#F5F5F5' // Background color of the sidebar (navigation bar).
        },
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
          backgroundColor: '#0C0C0C', // Background color of the top bar.
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#F5F5F5', // Color of the burger icon.
        },
      },
    },
    MuiListItemText: {
    styleOverrides: {
      primary: {
        fontSize: '14px', // Sidebar (navigation bar) font size.
      },
    },
  },
  },
});

export default mainTheme;
