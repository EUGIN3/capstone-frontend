import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Popover,
  Tooltip,
  Badge
} from '@mui/material';
import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import AxiosInstance from '../API/AxiosInstance';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

import { useNavigate } from 'react-router-dom';

const NotificationPanel = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  const popoverId = open ? 'notification-popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await AxiosInstance.get('/notifications/notifications/');
        const formatted = response.data.map(n => ({
          id: n.id,
          title: n.header,
          message: n.message,
          link: n.link,
          is_read: n.is_read
        }));
        setNotifications(formatted);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const clickNotification = async (notification) => {
    try {
      await AxiosInstance.patch(`/notifications/notifications/${notification.id}/mark_as_read/`);
      setNotifications(prev =>
        prev.map(note =>
          note.id === notification.id ? { ...note, is_read: true } : note
        )
      );

      if (notification.link && notification.link !== null) {
        navigate(notification.link);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await AxiosInstance.patch('/notifications/notifications/mark_all_as_read/');
      setNotifications(prev => prev.map(note => ({ ...note, is_read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  return (
    <>
      <Tooltip title="Notifications" arrow>
        <IconButton color="inherit" onClick={handleClick}>
          <Badge
            badgeContent={notifications.filter(n => !n.is_read).length}
            color="error"
          >
            <NotificationsTwoToneIcon sx={{ color: '#f5f5f5' }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        id={popoverId}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 500,
            maxHeight: 500,
            borderRadius: 2,
            boxShadow: 4,
            backgroundColor: '#fff',
            color: '#0c0c0c',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
            Notifications
          </Typography>
          <Tooltip title='Mark all as read' arrow>
            <MarkEmailReadIcon 
              sx={{ 
                color: '#0c0c0c',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover':{
                  color: '#0c0c0cb6',
                },
              }} 
              onClick={() => markAllAsRead()}
            />
          </Tooltip>
        </Box>

        <Divider />

        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <Typography sx={{ textAlign: 'center', p: 2, fontSize: '14px' }}>
              No new notifications
            </Typography>
          ) : (
            <List disablePadding>
              {notifications.map((note, index) => (
                <React.Fragment key={note.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      py: 1.2,
                      px: 2,
                      backgroundColor: note.is_read ? '#f5f5f5' : '#e4e4e4',
                      cursor: 'pointer',
                      display:'flex',
                      alignItems:'center',
                      transition: 'all 0.1s',
                      '&:hover':{
                        backgroundColor: '#0c0c0c2c',
                      },
                    }}
                    onClick={() => clickNotification(note)}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontSize: '14px',
                            fontWeight: note.is_read ? 500 : 600,
                          }}
                        >
                          
                          {note.title}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            fontSize: '13px',
                            color: '#555',
                            wordWrap: 'break-word',
                            fontWeight: note.is_read ? 400 : 600,
                          }}
                        >
                          {note.message}
                        </Typography>
                      }
                    />
                    { note.is_read ? null : <FiberManualRecordIcon sx={{fontSize: '13px', color:'#F04438'}}/>}
                  </ListItem>
                  {index < notifications.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPanel;
