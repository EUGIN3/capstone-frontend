import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';
// Images
import logo from '../../../assets/logo v2.png';
import mainTheme from './theme';
// Components
import useNavigation from './navigation';
import PropTypes from 'prop-types';
import AxiosInstance from '../../API/AxiosInstance'

import SidebarFooterAccount from './SidebarFooterAccount';

import UserDashboard from '../user-dashboard/UserDashboard'

import SetAppointment from '../set-appointment/SetAppointment';
import DisplayAppointments from '../display-appointment/DisplayAppointments'

import ImageGeneratorComponent from '../../ImageGenerator/ImageGeneratorComponent';

import Notification from '../../Notification/Notification';

import UserGallery from '../user-gallery/UserGallery';

function Navbar({ window }) {
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
    AxiosInstance.get(`auth/profile/`)
      .then((response) => {
        const { first_name, last_name, email, image } = response.data;

        const fullName = [first_name, last_name].filter(Boolean).join(' ').trim();

        setSession({
          user: {
            name: fullName || '',
            email: email || '',
            image: image || '',
          },
        });
      });
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
        logo: <img src={logo} alt="Ramil's logo." style={{ height: '30px', width: '170px' }} />,
        title: '',
        homeUrl: '/user/dashboard',
      }}
    >
      <DashboardLayout
        slots={{
          sidebarFooter: SidebarFooterAccount,
        }}
        sidebarExpandedWidth="240px"
        disableCollapsibleSidebar
      >
        <div className='appMainContainer'>
              <Routes>
                {/* Specified routes */}
                <Route path="/" element={<Navigate to="/user/dashboard" />} />
                <Route path="/dashboard" element={<UserDashboard />} />

                {/* <Route path="/appointment/all-appointments" element={<DisplayAppointments />} />
                <Route path="/appointment/set-appointment" element={<SetAppointment />} /> */}

                <Route path="/all-appointments" element={<DisplayAppointments />} />
                <Route path="/set-appointment" element={<SetAppointment />} />
                <Route path="/generate" element={<ImageGeneratorComponent />} />

                <Route path="/notification" element={<Notification />} />

                <Route path="/gallery" element={<UserGallery />} />

                {/* If routes is not belong to the specified. */}
                {/* <Route path="*" element={<Navigate to="/not-found" />} /> */}
              </Routes>
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;


