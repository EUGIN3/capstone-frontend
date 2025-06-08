import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { Controller } from 'react-hook-form'

import { FormHelperText } from '@mui/material';

export default function MyPassField(props) {
  const {label, classes, name, control} = props

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Controller 
        name={name}
        control={control}
        render={({
          field : {onChange, value},
          fieldState : {error},
          formState
        }) => (
          <FormControl variant="outlined" className={classes}
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '14px',
                '&::placeholder': {
                  fontSize: '14px',
                },
                '& input': {
                  fontSize: '14px',
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
              },
              '& .MuiInputLabel-root': {
                color: '#2d2d2db6',
                fontSize: '14px',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#0C0C0C',
                fontSize: '14px',
              },
            }}
          >
              <InputLabel className={`${error ? 'label-red' : ''}`}

              htmlFor="outlined-adornment-password">{label}</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                onChange={onChange}
                value={value}
                error={!!error}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                    <IconButton
                        aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                }
              label={label}
              />
              <FormHelperText sx={{color:"#d32f2f"}}> {error?.message} </FormHelperText>
          </FormControl>
        )}
      />
    </>
  );
}
