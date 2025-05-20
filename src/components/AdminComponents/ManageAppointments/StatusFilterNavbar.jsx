import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AllAppointment } from './AllAppointment';
import { ApproveAppointment } from './ApproveAppointment';
import { DeniedAppointment } from './DeniedAppointment';
import { PendingAppointment } from './PendingAppointment';

import './styles/StatusFilterNavbar.css';

export default function StatusFilterNavbar() {
  const [value, setValue] = React.useState('all');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="statusFilterNavbar">
      <Tabs
        value={value}
        onChange={handleChange}
      >
        <Tab label="All" value='all' />
        <Tab label="Pending" value='pending' />
        <Tab label="Approve" value='approved' />
        <Tab label="Deny" value='denied' />
      </Tabs>

      <div className="statusFilterNavbar-appointmentList">
        {value === 'all' && <AllAppointment />}
        {value === 'approved' && <ApproveAppointment />}
        {value === 'denied' && <DeniedAppointment />}
        {value === 'pending' && <PendingAppointment />}
      </div>
    </div>
  );
}
