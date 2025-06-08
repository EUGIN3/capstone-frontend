import { useState, useEffect } from 'react';
// Icons
import DashboardTwoToneIcon from '@mui/icons-material/DashboardTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import CollectionsTwoToneIcon from '@mui/icons-material/CollectionsTwoTone';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import ForumTwoToneIcon from '@mui/icons-material/ForumTwoTone';


const useNavigation = () => {
  return [
    { segment: 'user/dashboard', title: 'Dashboard', icon: <DashboardTwoToneIcon /> },
    { segment: 'user/notification', title: 'Notification', icon: <NotificationsNoneTwoToneIcon /> },
    { segment: 'user/message', title: 'Message', icon: <ForumTwoToneIcon /> },
    { segment: 'user/generate', title: 'Generate Design', icon: <AddPhotoAlternateTwoToneIcon /> },
    { segment: 'user/schedule', title: 'Schedule', icon: <ScheduleTwoToneIcon /> },
    { segment: 'user/set-appointment', title: 'Set Appointment', icon: <EditCalendarTwoToneIcon /> },
    { segment: 'user/all-appointments', title: 'Appointments', icon: <EventNoteTwoToneIcon /> },
    { segment: 'user/gallery', title: 'Gallery', icon: <CollectionsTwoToneIcon /> },
  ];
};

export default useNavigation;
