import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import AxiosInstance from '../../API/AxiosInstance';

const SidebarFooterAccount = () => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('IsAdmin') === 'true';

  if (!isAdmin) return null;
  
  const logOUt = () => {
    AxiosInstance.post('logoutall/', {})
      .then(() => {
        sessionStorage.removeItem('Token');
        sessionStorage.removeItem('IsAdmin');
        navigate('/login');
      });
  };

  return (
    <div style={{ padding: '1rem' }} className='admin-sidebar-footer'>
      <Button
        variant="outlined"
        fullWidth
        startIcon={<AccountCircleTwoToneIcon />}
        onClick={() => navigate('/user')}
        sx={{
          backgroundColor: '#0C0C0C',
          color: '#F5F5F5',
          borderColor: '#F5F5F5',
          '&:hover': {
            opacity: .9,            
            color: '#0C0C0C', 
            backgroundColor: '#F5F5F5',
            borderColor: '#F5F5F5',
          },
          textTransform: 'capitalize',
        }}
      >
        User
      </Button>

      <Divider />

      <Button
        variant="outlined"
        fullWidth
        startIcon={<LogoutIcon />}
        onClick={() => logOUt()}
        sx={{
          backgroundColor: '#0C0C0C',
          color: '#ffffff',
          borderColor: '#F5F5F5',
          '&:hover': {
            opacity: .9,
            color: '#F5F5F5', 
            backgroundColor: '#F04438',
            borderColor: '#F04438',
          },
          textTransform: 'capitalize',
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default SidebarFooterAccount;
