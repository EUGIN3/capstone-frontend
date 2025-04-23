import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import axiosInstance from '../utils/axiosInstance';

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutAccount(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');
  const demoWindow = window !== undefined ? window() : undefined;

  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch user from Django backend on mount
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get('/api/user/');
        const userData = response.data;

        setSession({ 
            user: {
                email: userData.email
            },
         });
      } catch (error) {
        console.error('Error fetching user:', error);
        setSession(null); // or redirect to login
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {}, // You can implement login navigation
      signOut: () => {
        setSession(null);
        // Optional: axiosInstance.post('/api/logout/')
      },
    };
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>; // Or a fancy loader
  }

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutAccount.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccount;
