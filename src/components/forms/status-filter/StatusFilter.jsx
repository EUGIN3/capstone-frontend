import React, { useState } from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';

function StatusFilter({ onFilterChange }) {
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
    if (onFilterChange) {
      onFilterChange(selectedStatus);
    }
  };

  return (
    <div className='view-appt-status-picker'>
      <FormControl fullWidth>
        <Select
          value={status}
          onChange={handleChange}
          displayEmpty
        >
          <MenuItem value=""><em>All</em></MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="denied">Denied</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="cancelled">Cancelled</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default StatusFilter;
