import { useState, useEffect } from 'react';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import EastTwoToneIcon from '@mui/icons-material/EastTwoTone';

// Admin
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';

const useNavigation = () => {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('IsAdmin') === 'true';
    setAdmin(isAdmin);
  }, []);

  return [
    { segment: 'user/dashboard', title: 'Dashboard', icon: <DashboardTwoToneIcon /> },
    { segment: 'user/appointment', title: 'Appointment', icon: <CalendarMonthTwoToneIcon />, 
      children: [
        { segment: 'all-appointments', title: 'View all appointments', icon: <EventNoteTwoToneIcon /> },
        { segment: 'set-appointment', title: 'Set an appointment', icon: <EditCalendarTwoToneIcon /> },
      ],  
    },
    ...(admin ? [{ segment: 'admin/', title: <div className='sideNavigaitonIcon'>Go To Admin Panel <EastTwoToneIcon/></div>, icon: <AdminPanelSettingsTwoToneIcon /> }] : []),
  ];
};

export default useNavigation;