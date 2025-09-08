import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function MultilineTextFields({ label, className }) {
  return (
    <TextField
      id="standard-multiline-flexible"
      label={label}
      className={className}
      multiline
      minRows={5}
      maxRows={5}
      variant="standard"
      sx={{
        // Label static
        '& label': {
          color: '#F5F5F5',
        },
        // Label when focused
        '& label.Mui-focused': {
          color: '#F5F5F5',
        },
        // Label on hover
        '&:hover label': {
          color: '#F5F5F5',
        },
        // Underline default (before focus)
        '& .MuiInput-underline:before': {
          borderBottomColor: '#F5F5F5',
        },
        // Underline on hover (before focus)
        '&:hover .MuiInput-underline:before': {
          borderBottomColor: '#F5F5F5',
        },
        // Underline when focused (after)
        '& .MuiInput-underline:after': {
          borderBottomColor: '#F5F5F5',
        },
      }}
    />
  );
}
