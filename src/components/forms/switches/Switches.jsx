import React from 'react';
import { Switch } from '@mui/material';
import { Tooltip } from '@mui/material';

function Switches({ title, checked, onChange }) {
  return (
    <div>
      <Tooltip title={title} arrow>
        <Switch
          checked={checked}           // <-- make sure checked is set
          onChange={onChange}         // <-- forward the onChange!
          sx={{
            '& .MuiSwitch-thumb': {
              backgroundColor: '#6e6e6eff', // color of the circle toggle
            },
            '& .Mui-checked .MuiSwitch-thumb': {
              backgroundColor: '#000000ff', // color of the circle when checked
            },
            '& .MuiSwitch-track': {
              backgroundColor: '#bdbdbdff', // background track color when unchecked
            },
            '& .Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#0c0c0c', // background track color when checked
            },
          }}
        />
      </Tooltip>
    </div>
  );
}

export default Switches;
