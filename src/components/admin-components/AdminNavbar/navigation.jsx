import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import ForumTwoToneIcon from '@mui/icons-material/ForumTwoTone';
import CollectionsTwoToneIcon from '@mui/icons-material/CollectionsTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import CalendarMonthTwoToneIcon from '@mui/icons-material/CalendarMonthTwoTone';
import FreeCancellationTwoToneIcon from '@mui/icons-material/FreeCancellationTwoTone';
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone';

import './AdminNavbar.css'


const useNavigation = () => {
  return [
    { segment: 'admin/dashboard', title: 'Dashboard', 
      icon: 
        <div className='adminSideIcon'>
          <DashboardTwoToneIcon />
        </div> },

    { segment: 'admin/manage-schedule', title: 'Schedule', 
      icon: 
        <div className='adminSideIcon'>
          <ScheduleTwoToneIcon />
        </div> },

    { segment: 'admin/manage-appointments', title: 'Appointments', 
      icon: 
        <div className='adminSideIcon'>
          <EventNoteTwoToneIcon />
        </div>,
    },

    { segment: 'admin/approved-appointment', title: 'Approved', 
      icon: 
        <div className='adminSideIcon'>
          <EventAvailableTwoToneIcon />
        </div>,
    },

    { segment: 'admin/notification', title: 'Notifications', 
      icon: 
        <div className='adminSideIcon'>
          <NotificationsNoneTwoToneIcon />
        </div> },

    { segment: 'admin/message', title: 'Messages', 
      icon: 
        <div className='adminSideIcon'>
          <ForumTwoToneIcon />
        </div> },

    { segment: 'admin/generate', title: 'Generate Design', 
      icon: 
        <div className='adminSideIcon'>
          <AddPhotoAlternateTwoToneIcon />
        </div> },
        
    { segment: 'admin/manage-gallery', title: 'Gallery', 
      icon: 
        <div className='adminSideIcon'>
          <CollectionsTwoToneIcon />
        </div> },

    { segment: 'admin/manage-user', title: 'Users', 
      icon: 
        <div className='adminSideIcon'>
          <PeopleTwoToneIcon />
        </div> },

    { segment: 'admin/manage-designs', title: 'Designs', 
      icon: 
        <div className='adminSideIcon'>
          <PeopleTwoToneIcon />
        </div> },
  ];
};

export default useNavigation;