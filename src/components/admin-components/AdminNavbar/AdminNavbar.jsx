import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  Badge,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Tooltip,
} from '@mui/material';
import { styled, useTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import Logout from '@mui/icons-material/Logout';
import { Account } from '@toolpad/core/Account';
import { AppProvider } from '@toolpad/core/AppProvider';

// Custom
import useNavigation from './navigation';
import AxiosInstance from '../../API/AxiosInstance';
import mainTheme from './theme';
import './AdminNavbar.css';

// Pages
import AdminDashboard from '../admin-dashboard/AdminDashboard';
import ManageAppointment from '../manage-appointment/ManageAppointment';
import ManageSchedule from '../manage-schedule/ManageSchedule';
import ManageUser from '../manage-user/ManageUser';
import NotificationPanel from '../../notification/Notification'
import AdminGallery from '../admin-gallery/AdminGallery';
import AdminMessages from '../admin-messages/AdminMessages';
import Designs from '../manage-designs/Designs';
import ManageApproveAppointment from '../manage-approved/ManageApproved';
import OnGoingProjectsTable from '../manage-ongoing/ongoing-table/OnGoingProjectsTable';
import ManageOngoingUpdates from '../manage-ongoing/ongoing-updates/ManageOngoingUpdates';
import ButtonElement from '../../forms/button/ButtonElement';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const drawerWidth = 240;

// ✅ Persistent Drawer Layout Components
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
  }),
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

export default function AdminNavbar() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  const [session, setSession] = useState({
    user: { name: '', email: '', image: '' },
  });

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Logout
  const logOut = () => {
    AxiosInstance.post('logoutall/', {}).then(() => {
      sessionStorage.removeItem('Token');
      sessionStorage.removeItem('IsAdmin');
      navigate('/login');
    });
  };

  const authentication = React.useMemo(() => ({ signOut: logOut }), []);

  const userInformation = () => {
    AxiosInstance.get('auth/profile/').then((response) => {
      const { first_name, last_name, email, image } = response.data;
      setSession({
        user: {
          name: `${first_name} ${last_name === null ? '' : last_name}`,
          email,
          image,
        },
      });
    });
  };

  useEffect(() => {
    userInformation();
  }, []);

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
              
              <Typography variant="h6" noWrap component="div" sx={{ color: '#f5f5f5' }}>
                Admin
              </Typography>

              <Box sx={{ flex: 1 }} />

              {/* Icons */}
              <Tooltip title="Messages" arrow>
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="error">
                    <MailTwoToneIcon sx={{ color: '#f5f5f5' }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              
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
                backgroundColor: '#1e1e1e',
                color: '#f5f5f5',
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
              sx={{marginTop:'3.5px', borderColor:'#f5f5f531', marginBottom:'5px'}}
            />

            <List>
              {navigation.map((item) => (
                <ListItem key={item.segment} disablePadding>
                  <ListItemButton
                    onClick={() => navigate(`/${item.segment}`)}
                    selected={location.pathname === `/${item.segment}`}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      // px: 2.5,
                      mx: 1,
                      borderRadius: '6px',
                      marginLeft: '15px',
                      marginRight: '15px',
                      color: '#f5f5f58f',
                      '& .MuiListItemIcon-root': {
                        color: '#f5f5f58f',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#acacac54',
                        borderLeft: '4px solid #f5f5f5',
                        color: '#f5f5f5',
                        '& .MuiListItemIcon-root': {
                          color: '#f5f5f5', 
                        },
                      },
                      '&:hover': {
                        backgroundColor: '#acacac30',
                      },
                      '&.Mui-selected:hover': {
                        backgroundColor: '#acacac80',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: '#f5f5f5', minWidth: 0, mr: open ? 2 : 'auto' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>


            <Box sx={{mt: 'auto', marginBottom: '10px', marginLeft: '20px', marginRight: '20px', height:'40px', }}> 
              <ButtonElement label='USER PANEL' variant='outlined-white user-admin' type='button' onClick={() => navigate('/user')} /> 
            </Box> 
          </MuiDrawer>

          {/* ✅ Main Content */}
          <Main open={open}>
            <DrawerHeader />
            <Routes>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/manage-appointments" element={<ManageAppointment />} />
              <Route path="/manage-schedule" element={<ManageSchedule />} />
              <Route path="/manage-user" element={<ManageUser />} />
              <Route path="/manage-gallery" element={<AdminGallery />} />
              <Route path="/approved-appointment" element={<ManageApproveAppointment />} />
              <Route path="/message" element={<AdminMessages />} />
              <Route path="/on-going-project" element={<OnGoingProjectsTable />} />
              <Route path="/on-going-project/:projectId" element={<ManageOngoingUpdates />} />
            </Routes>
          </Main>
        </Box>
      </AppProvider>
    </ThemeProvider>
  );
}

AdminNavbar.propTypes = {
  window: PropTypes.func,
};
