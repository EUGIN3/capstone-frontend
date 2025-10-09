import './AdminNavbar.css'

import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useLocation, useNavigate } from 'react-router-dom';
// Images
import logo from '../../../assets/admin.png';
import mainTheme from './theme';
// Components
import PropTypes from 'prop-types';
import useNavigation from './navigation';
import AxiosInstance from '../../API/AxiosInstance';

import SidebarFooterAccount from './SidebarFooterAccount'


// import { ManageUser } from '../ManageUser/ManageUser';
import AdminDashboard from '../admin-dashboard/AdminDashboard';
import ManageAppointment from '../manage-appointment/ManageAppointment';
import ManageSchedule from '../manage-schedule/ManageSchedule';
import ImageGeneratorComponent from '../../ImageGenerator/ImageGeneratorComponent';

import ManageUser from '../manage-user/ManageUser'

import Notification from '../../Notification/Notification';

import AdminGallery from '../admin-gallery/AdminGallery'

import AdminMessages from '../admin-messages/AdminMessages';

import Designs from '../manage-designs/Designs';

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
    AxiosInstance.get('auth/profile/', {})
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
        logo: <img src={logo} alt="Ramil's logo." style={{ height: '20px', width: '200px' }} />, 
        title: '',
        homeUrl: '/admin/dashboard',
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
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/manage-appointments" element={<ManageAppointment />} />
                <Route path="/manage-designs" element={<Designs />} />
                <Route path="/manage-schedule" element={<ManageSchedule />} />
                <Route path="/generate" element={<ImageGeneratorComponent />} />
                <Route path="/manage-user" element={<ManageUser />} />
                <Route path="/manage-gallery" element={<AdminGallery />} />

                <Route path="/notification" element={<Notification />} />

                <Route path="/message" element={<AdminMessages />} />
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


