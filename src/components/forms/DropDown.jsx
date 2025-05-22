import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function DropdownConponent(props) {
  const { items, onChange, dropDownLabel } = props;
  const [selectedValue, setSelectedValue] = useState('');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{dropDownLabel}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label={dropDownLabel}
        value={selectedValue}
        onChange={handleChange}
      >
        <MenuItem value="">None</MenuItem>
        {items.map((item, index) => (
          <MenuItem key={index} value={item.value} disabled={item.disabled}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
