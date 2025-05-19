import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import EastTwoToneIcon from '@mui/icons-material/EastTwoTone';

import '../../../index.css'

const useNavigation = () => {
  return [
    { segment: 'admin/manage-user', title: 'Manage Users', icon: <ManageAccountsTwoToneIcon /> },
    { segment: 'admin/manage-appointments', title: 'Manage Appointments', icon: <EventNoteTwoToneIcon /> },
    { segment: 'admin/manage-schedule', title: 'Manage Schedule', icon: <ScheduleTwoToneIcon /> },
    { segment: 'admin/generate', title: 'Generate Design', icon: <AddPhotoAlternateTwoToneIcon /> },
    { segment: 'user/', title: <div className='sideNavigaitonIcon'>Go To User Panel <EastTwoToneIcon/></div>, icon: <AccountCircleTwoToneIcon /> },
  ];
};

export default useNavigation;