import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '../../../assets/admin.png';
import mainTheme from '../../Navbar/theme';
import useNavigation from './navigation';
import AxiosInstance from '../../AxiosInstance';

import { Routes, Route, Navigate } from 'react-router-dom';


function AdminNavbar({ window }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = useNavigation()

  const [session, setSession] = useState({
    user: {
      name: '',
      email: '',
      image: '',
    },
  });

  const logOUt = () => {
    AxiosInstance.post('logoutall/', {})
      .then(() => {
        sessionStorage.removeItem('Token');
        sessionStorage.removeItem('IsAdmin');
        navigate('/login');
      });
  };

  const userInformation = () => {
    AxiosInstance.get('profile/', {})
      .then((response) => {
        const { first_name, last_name, email, image } = response.data;
        setSession({
          user: {
            name: first_name+' '+last_name || '',
            email: email || '',
            image: image || '',
          },
        });
      })
  };

  useEffect(() => {
    userInformation();
  }, []);

  const authentication = useMemo(() => {
    return {
      signIn: () => {
        setSession({ user: {} });
      },
      signOut: () => {
        logOUt();
      },
    };
  }, []);

  const router = {
    pathname: location.pathname,
    navigate: (path) => navigate(path),
  };

  const mainWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={navigation}
      router={router}
      theme={mainTheme}
      window={mainWindow}
      branding={{
        logo: <img src={logo} alt="Ramil's logo." style={{ height: '50px', width: '200px' }} />, 
        title: '',
        homeUrl: '/admin',
      }}
    >
      <DashboardLayout 
        sidebarExpandedWidth="280px"
      >
        <div className='appMainContainer'>
              <Routes>

              </Routes>
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}

AdminNavbar.propTypes = {
  window: PropTypes.func,
};

export default AdminNavbar;


