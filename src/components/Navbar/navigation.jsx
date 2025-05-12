import { useState, useEffect } from 'react';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';

// Admin
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';

const useNavigation = () => {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('IsAdmin') === 'true';
    setAdmin(isAdmin);
  }, []);

  return [
    ...(admin ? [{ segment: 'admin', title: 'Dashboard', icon: <AdminPanelSettingsTwoToneIcon /> }] : []),
    { segment: 'user/dashboard', title: 'Dashboard', icon: <DashboardTwoToneIcon /> },
    { segment: 'user/appointment', title: 'Appointment', icon: <CalendarMonthTwoToneIcon />, 
      children: [
        { segment: 'all-appointments', title: 'All Appointments', icon: <EventNoteTwoToneIcon /> },
        { segment: 'set-appointment', title: 'Set Appointment', icon: <EditCalendarTwoToneIcon /> },
      ],  
    },
  ];
};

export default useNavigation;