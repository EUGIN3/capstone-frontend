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
          main: '#F5F5F5' // Main color for text, sidebar (navigation bar) text color when selected. 
        }, 
        background: { 
          default: '#F5F5F5', // Background color of the app pages.
          paper: '#F5F5F5' 
        },
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
  components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: '#ee2424ff', // Only affects sidebar
            color: '#ce0d0dff', // Text inside sidebar
            scrollbarWidth: 'thin',              // For Firefox
            scrollbarColor: '#ff0000ff #ec1818ff', 
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#0C0C0C', // Background color of the top bar.
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
