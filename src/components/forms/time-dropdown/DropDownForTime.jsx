import React from 'react';
import { Controller } from 'react-hook-form';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

export default function DropdownComponentTime({
  items,
  onChange,
  dropDownLabel,
  name,
  control,
  className,
}) {
  return (
    <FormControl
      fullWidth
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      className={className}
    >
      <InputLabel
        sx={{
          color: '#2d2d2db6',
          fontSize: '14px',
          '&.Mui-focused': {
            color: '#0C0C0C',
            fontSize: '14px',
          },
        }}
      >
        {dropDownLabel}
      </InputLabel>

      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <>
            <Select
              label={dropDownLabel}
              value={field.value || ''}
              onChange={(e) => {
                field.onChange(e.target.value);
                if (onChange) onChange(e.target.value);
              }}
              error={!!fieldState.error}
              sx={{
                height: '100%',
                fontSize: '14px',
                '& .MuiSelect-select': {
                  fontSize: '14px',
                  padding: '14px',
                },
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
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#2d2d2db6',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0C0C0C',
                  borderWidth: '2px',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#0C0C0C',
                },
              }}
            >
              <MenuItem value="">None</MenuItem>
              {items.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item.value}
                  disabled={item.disabled}
                  sx={{ fontSize: '14px' }}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Select>

            {fieldState.error && (
              <FormHelperText error sx={{ fontSize: '12px' }}>
                {fieldState.error.message}
              </FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
}
