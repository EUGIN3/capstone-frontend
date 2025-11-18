import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function NoControl({ label, classes, placeHolder, value, onChange, autoComplete }) {
  return (
    <TextField
      id="outlined-input"
      label={label}
      placeholder={placeHolder}
      value={value}
      onChange={onChange}
      fullWidth
      autoComplete={autoComplete}
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          fontSize: '14px',
          '& input': { fontSize: '14px' },
          '& fieldset': { borderColor: '#2d2d2db6' },
          '&:hover fieldset': { borderColor: '#0C0C0C', borderWidth: '2px' },
          '&.Mui-focused fieldset': { borderColor: '#0C0C0C' },
        },
        '& .MuiInputLabel-root': { color: '#2d2d2db6', fontSize: '14px' },
        '& .MuiInputLabel-root.Mui-focused': { color: '#0C0C0C', fontSize: '14px' },
      }}
      className={classes}
    />
  );
}
