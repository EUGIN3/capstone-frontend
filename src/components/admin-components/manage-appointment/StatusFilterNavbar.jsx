import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import './styles/StatusFilterNavbar.css';

export default function StatusFilterNavbar({ onTabChange }) {
  const [value, setValue] = useState('all');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  return (
    <div className="statusFilterNavbar">
      <Tabs
        value={value}
        onChange={handleChange}
      >
        <Tab label="All" value="all" />
        <Tab label="Pending" value="pending" />
        <Tab label="Approved" value="approved" />
        <Tab label="Cancelled" value="cancelled" />
        <Tab label="Denied" value="denied" />
      </Tabs>
    </div>
  );
}

