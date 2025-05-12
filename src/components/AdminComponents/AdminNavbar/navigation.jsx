import { useState, useEffect } from 'react';
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';

const useNavigation = () => {
  return [
    { segment: 'user/', title: 'User panel', icon: <AccountCircleTwoToneIcon /> },
  ];
};

export default useNavigation;