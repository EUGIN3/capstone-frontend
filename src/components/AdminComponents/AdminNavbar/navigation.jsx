import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import EventNoteTwoToneIcon from '@mui/icons-material/EventNoteTwoTone';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import EastTwoToneIcon from '@mui/icons-material/EastTwoTone';

import '../../../index.css'

const useNavigation = () => {
  return [
    { segment: 'admin/manage-user', title: 'Manage Users', 
      icon: 
        <div className='adminSideIcon'>
          <ManageAccountsTwoToneIcon />
        </div> },
    { segment: 'admin/manage-appointments', title: 'Manage Appointments', 
      icon: 
        <div className='adminSideIcon'>
          <EventNoteTwoToneIcon />
        </div> },
    { segment: 'admin/manage-schedule', title: 'Manage Schedule', 
      icon: 
        <div className='adminSideIcon'>
          <ScheduleTwoToneIcon />
        </div> },
    { segment: 'admin/generate', title: 'Generate Design', 
      icon: 
        <div className='adminSideIcon'>
          <AddPhotoAlternateTwoToneIcon />
        </div> },
    { segment: 'user/', title: <div className='sideNavigaitonIcon adminSideIcon'>Go To User Panel <EastTwoToneIcon/></div>, 
      icon: 
        <div className='adminSideIcon'>
          <AccountCircleTwoToneIcon />
        </div> },
  ];
};

export default useNavigation;