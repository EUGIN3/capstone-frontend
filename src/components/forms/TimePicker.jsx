import * as React from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

export default function TimePickerComponent({value, onChange}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MobileTimePicker 
        label="Time"
        value={value}
        onChange={onChange}
        defaultValue={dayjs('2022-04-17T07:00')}
        slotProps={{
          textField: {
            fullWidth: true,
            InputProps: {
              sx: {
                  fontSize: '14px',
                },
              },
            sx: {
              '& .MuiInputLabel-root': {
                fontSize: '14px', 
              },
              '& .MuiSvgIcon-root': {
                color: '#6c6c6c', 
              },
              '&:hover .MuiSvgIcon-root': {
                color: '#0C0C0C', 
              },
              '&.Mui-focused .MuiSvgIcon-root': {
                color: '#0C0C0C', 
              },
              '&:hover fieldset': {
                borderColor: '#0C0C0C',
                borderWidth: '2px',
              },
              '& fieldset': {
                borderColor: '#2d2d2db6',
              },
            },
          },
          mobilePaper: {
            sx: {
              padding: '20px',
              width: '90%',
              maxWidth: '400px',
              backgroundColor: '#f5f5f5',

              // '& .MuiButtonBase-root': {
              //   color: '#0C0C0C',  
              // },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
