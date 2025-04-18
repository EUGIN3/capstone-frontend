import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../../App.css'

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
      <FormControl variant="outlined" className={classes}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '16px',
            '&::placeholder': {
              fontSize: '16px',
            },
            '& input': {
              fontSize: '16px',
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
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#0C0C0C',
          },
        }}
      >
          <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
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
          name={name}
          control={control}
          />
      </FormControl>
    </>
  );
}
