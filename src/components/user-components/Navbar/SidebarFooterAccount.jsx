import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsTwoToneIcon from '@mui/icons-material/AdminPanelSettingsTwoTone';
import LogoutIcon from '@mui/icons-material/Logout';
import Divider from '@mui/material/Divider';
import AxiosInstance from '../../API/AxiosInstance';


const SidebarFooterAccount = () => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('IsAdmin') === 'true';

  const logOUt = () => {
    AxiosInstance.post('logoutall/', {})
      .then(() => {
        sessionStorage.removeItem('Token');
        sessionStorage.removeItem('IsAdmin');
        navigate('/login');
      });
  };

  return (
    <div style={{ padding: '1rem' }} className='user-sidebar-footer'>
      {
        isAdmin ? 
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AdminPanelSettingsTwoToneIcon/>} 
          onClick={() => navigate('/admin')}
          sx={{
            backgroundColor: '#F5F5F5',
            color: '#0C0C0C',
            borderColor: '#0C0C0C',
            '&:hover': {
              opacity: .9,            
              color: '#F5F5F5', 
              backgroundColor: '#0C0C0C',
              borderColor: '#0C0C0C',
            },
            textTransform: 'capitalize',
          }}
        > 
          Admin
        </Button>

        : null
      }
      

      <Divider />

      <Button
        variant="outlined"
        fullWidth
        startIcon={<LogoutIcon />}
        onClick={() => logOUt()}
        sx={{
          backgroundColor: '#F5F5F5',
          color: '#0C0C0C',
          borderColor: '#0C0C0C',
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
