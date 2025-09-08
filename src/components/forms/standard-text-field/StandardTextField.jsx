import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function BasicTextFields({ label, className }) {
  return (
    <TextField 
      id="standard-basic" 
      label={label}
      className={className}
      variant="standard"
      sx={{
        // Label (static, hover, and focus)
        '& label': {
          color: '#f5f5f5',
        },
        '& label.Mui-focused': {
          color: '#f5f5f5',
        },
        '&:hover label': {
          color: '#f5f5f5',
        },
        // Underline (default, hover, and focus)
        '& .MuiInput-underline:before': {
          borderBottomColor: '#f5f5f5',
        },
        '&:hover .MuiInput-underline:before': {
          borderBottomColor: '#f5f5f5',
        },
        '& .MuiInput-underline:after': {
          borderBottomColor: '#f5f5f5',
        },
      }}
    />
  );
}
