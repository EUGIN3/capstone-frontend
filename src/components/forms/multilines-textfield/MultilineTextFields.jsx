import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function MultilineTextFields({  placeholder, className }) {
  return (
    <TextField
      id="outlined-multiline-static"
      // label={label}
      className={className}
      placeholder={placeholder}
      multiline
      rows={4}
      fullWidth
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#2d2d2db6',
          },
          '&:hover fieldset': {
            borderColor: '#0C0C0C',
            borderWidth: '2px',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#0C0C0C',
          },
        },
      }}
    />
  );
}
