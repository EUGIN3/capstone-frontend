import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Typography,
  IconButton,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Tooltip,
  Badge,
} from '@mui/material';
import { styled, useTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Logout from '@mui/icons-material/Logout';
import { Account } from '@toolpad/core/Account';
import { AppProvider } from '@toolpad/core/AppProvider';
import './Navbar.css'
// Custom imports
import AxiosInstance from '../../API/AxiosInstance';
import useNavigation from './navigation';
import mainTheme from './theme';
import logo from '../../../assets/logo v2.png';
// Pages
import UserDashboard from '../user-dashboard/UserDashboard';
import SetAppointment from '../set-appointment/SetAppointment';
import DisplayAppointments from '../display-appointment/DisplayAppointments';
import ImageGeneratorComponent from '../../ImageGenerator/ImageGeneratorComponent';
import UserGallery from '../display-gallery/UserGallery';
import UserMessages from '../user-messages/UserMessages';
import ButtonElement from '../../forms/button/ButtonElement';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import UserProjects from '../user-projects/UserProjects';
import NotificationPanel from '../../notification/Notification';
import ManageSchedule from '../user-schedule/UserManageSchedule';

import ProjectDetails from '../user-projects/ProjectDetails/ProjectDetails';

// Drawer width
const drawerWidth = 240;

// ✅ Persistent Drawer Layout Components (Same as Admin)
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

function Navbar({ window }) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const isAdmin = sessionStorage.getItem('IsAdmin') === 'true';

  const [session, setSession] = useState({
    user: { name: '', email: '', image: '' },
  });

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const logOUt = () => {
    AxiosInstance.post('logoutall/', {}).then(() => {
      sessionStorage.removeItem('Token');
      sessionStorage.removeItem('IsAdmin');
      navigate('/login');
    });
  };

  const userInformation = () => {
    AxiosInstance.get('auth/profile/').then((response) => {
      const { first_name, last_name, email, image } = response.data;
      // const fullName = [first_name, last_name].filter(Boolean).join(' ').trim();
      setSession({
        user: {
          name: `${first_name} ${last_name === null ? '' : last_name}`,
          email: email || '',
          image: image || '',
        },
      });
    });
  };

  useEffect(() => {
    userInformation();
  }, []);

  const authentication = useMemo(
    () => ({
      signOut: logOUt,
    }),
    []
  );

  return (
    <ThemeProvider theme={mainTheme}>
      <AppProvider authentication={authentication} session={session} theme={mainTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />

          {/* ✅ Top AppBar */}
          <AppBar position="fixed" open={open}>
            <Toolbar>
              { open ? 
                <Tooltip title='Close' arrow>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={open ? handleDrawerClose : handleDrawerOpen}
                    edge="start"
                    sx={{ marginRight: 2}}
                  >
                    <MenuOpenIcon />
                  </IconButton>
                </Tooltip>
                :
                <Tooltip title='Menu' arrow>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={open ? handleDrawerClose : handleDrawerOpen}
                    edge="start"
                    sx={{ marginRight: 2}}
                  >
                    <MenuIcon />
                  </IconButton>
                </Tooltip> 
              }

              <img
                src={logo}
                alt="Logo"
                style={{ height: '30px', width: '170px', marginRight: '16px' }}
              />

              <Box sx={{ flexGrow: 1 }} />

              {/* <Tooltip title="Messages" arrow>
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="error">
                    <MailTwoToneIcon sx={{ color: '#f5f5f5' }} />
                  </Badge>
                </IconButton>
              </Tooltip> */}

              <NotificationPanel />

              <Box sx={{ ml: 1 }}>
                <Account
                  slotProps={{
                    signInButton: { color: 'success' },
                    signOutButton: { color: 'black', startIcon: <Logout /> },
                    popover: { sx: { '&::before': { display: 'none' }, borderRadius: '12px' } },
                    preview: {
                      variant: 'collapsed',
                      slotProps: {
                        avatarIconButton: {
                          sx: { width: 40, height: 40, marginLeft: '8px' },
                        },
                        avatar: { variant: 'circular' },
                      },
                    },
                  }}
                />
              </Box>
            </Toolbar>
          </AppBar>

          {/* ✅ Sidebar Drawer */}
          <MuiDrawer
            sx={{
              width: drawerWidth,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                backgroundColor: '#f5f5f5',
                color: '#0c0c0c8f',
              },
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader>
              <Box
                sx={{
                  display:'flex',
                  flexDirection:'column',
                  justifyContent:'center',
                  width:'100%',
                  height:'100%',
                }}
              
              >
                <Typography 
                  sx={{
                    fontSize:'14px',
                    width:'100%',
                    textAlign:'center',
                    color: '#0c0c0c',
                    lineHeight:'15px'
                  }}
                >{session.user.name}</Typography>
                <Typography 
                  sx={{
                    fontSize:'12px',
                    width:'100%',
                    textAlign:'center'
                  }}
                >{session.user.email}</Typography>
              </Box>
              
            </DrawerHeader>

            <Divider
              sx={{marginTop:'3.5px', marginBottom:'5px'}}
            />

            <List>
              {navigation.map((item) => (
                <ListItem key={item.segment} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(`/${item.segment}`)}
                    selected={location.pathname === `/${item.segment}`}
                    sx={{
                      mx: 1,
                      borderRadius: '6px',
                      marginLeft: '15px',
                      marginRight: '15px',
                      '& .MuiListItemIcon-root': {
                        color: '#0c0c0c8f',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#0c0c0c54',
                        borderLeft: '4px solid #0c0c0c',
                        color: '#0c0c0c',
                        '& .MuiListItemIcon-root': {
                          color: '#0c0c0c', 
                        },
                      },
                      '&:hover': {
                        backgroundColor: '#0c0c0c30',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: '#0c0c0c80',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 'auto' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            
            {/* Edit this as it should only display if the user is the admin */}
            {isAdmin && (
              <Box sx={{ mt: 'auto', mb: '10px', mx: '20px', height:'40px' }}>
                <ButtonElement
                  label='ADMIN PANEL'
                  variant='outlined-black admin-user'
                  type='button'
                  onClick={() => navigate('/admin')}
                />
              </Box>
            )}
          </MuiDrawer>

          {/* ✅ Main Content */}
          <Main open={open}>
            <DrawerHeader />
            <Routes>
              <Route path="/" element={<Navigate to="/user/dashboard" />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/all-appointments" element={<DisplayAppointments />} />
              <Route path="/set-appointment" element={<SetAppointment />} />
              <Route path="/projects" element={<UserProjects />} />
              <Route path="/generate" element={<ImageGeneratorComponent />} />
              <Route path="/gallery" element={<UserGallery />} />
              <Route path="/message" element={<UserMessages />} />
              <Route path="/deisgner-calendar" element={<ManageSchedule />} />
              <Route path="/on-going-project/:projectId" element={<ProjectDetails />} />
            </Routes>
          </Main>
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
