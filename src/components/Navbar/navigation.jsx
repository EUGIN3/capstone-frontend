import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';

const navigation = [
  { segment: 'user/dashboard', title: 'Dashboard', icon: <DashboardTwoToneIcon /> },

  { segment: 'user/appointment', title: 'Appointment', icon: <CalendarMonthTwoToneIcon />,
    children: [
      {
        segment: 'all-appointments',
        title: 'All Appointments',
        icon: <EventNoteTwoToneIcon />,
      },
      {
        segment: 'set-appointment',
        title: 'Set Appointment',
        icon: <EditCalendarTwoToneIcon />,
      },
    ],
  },
]

export default navigation;