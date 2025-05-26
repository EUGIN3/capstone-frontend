import React from 'react';
import { Controller } from 'react-hook-form';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormHelperText from '@mui/material/FormHelperText';

export default function DropdownComponentTime({ items, onChange, dropDownLabel, name, control }) {
  return (
    <FormControl fullWidth>
      <InputLabel>{dropDownLabel}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field, fieldState }) => (
          <>
            <Select
              label={dropDownLabel}
              value={field.value || ""}
              onChange={(e) => {
                field.onChange(e.target.value);
                if (onChange) onChange(e.target.value);
              }}
              error={!!fieldState.error}
            >
              <MenuItem value="">None</MenuItem>
              {items.map((item, index) => (
                <MenuItem key={index} value={item.value} disabled={item.disabled}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            {fieldState.error && (
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            )}
          </>
        )}
      />
    </FormControl>
  );
}
