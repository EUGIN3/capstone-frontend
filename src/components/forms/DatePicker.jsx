import  React, {useState} from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerComponent({value, onChange}) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date"
          value={value}
          onChange={onChange}
          disablePast
          slotProps={{
          textField: {
            InputProps: {
              sx: {
                  fontSize: '14px', // label text size
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
          popper: {
            sx: {
              '& .MuiPaper-root': {
                width: 320,  
                minWidth: 320,
                borderRadius: '12px',
              },
              '& .MuiPickersCalendarHeader-switchViewButton': {
                color: '#0C0C0C',
              },
              '& .MuiPickersArrowSwitcher-leftArrowIcon': {
                color: '#0C0C0C',
              },
              '& .MuiPickersArrowSwitcher-rightArrowIcon': {
                color: '#0C0C0C',
              },
            },
          },
        }}
        />
    </LocalizationProvider>
  );
}
