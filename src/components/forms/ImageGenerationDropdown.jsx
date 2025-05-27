import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';


import '../ImageGenerator/ImageGeneratorComponent.css';

export default function ImageGenerationDropdown({
  items,
  onChange,
  value,
  dropDownLabel,
  error,
  helperText,
}) {
  return (
    <FormControl fullWidth error={!!error} >
      <InputLabel>{dropDownLabel}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={dropDownLabel}
      >
        <MenuItem value="">None</MenuItem>
        {items.map((item, index) => (
          <MenuItem key={index} value={item.value} disabled={item.disabled}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}





