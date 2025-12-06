import React from 'react';
import { Switch } from '@mui/material';
import { Tooltip } from '@mui/material';

function Switches({ title, checked, onChange }) {
  return (
    <div>
      <Tooltip title={title} arrow>
        <Switch
          checked={checked} 
          onChange={onChange}         
          sx={{
            '& .MuiSwitch-thumb': {
              backgroundColor: '#6e6e6eff', 
            },
            '& .Mui-checked .MuiSwitch-thumb': {
              backgroundColor: '#000000ff', 
            },
            '& .MuiSwitch-track': {
              backgroundColor: '#202020ff', 
            },
            '& .Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#0c0c0c', 
            },
          }}
        />
      </Tooltip>
    </div>
  );
}

export default Switches;
