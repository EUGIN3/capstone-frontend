import * as React from 'react';

import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export default function NormalTextField(props) {
    const {label, classes, placeHolder, name, control} = props

    return (
        <> 
          <Controller 
            name={name}
            control={control}
            render={({
              field : {onChange, value},
              fieldState : {error},
              fieldState,
            }) => (
              <TextField 
                id="outlined-search"
                onChange={onChange}
                value={value || ''} 
                label={label}
                type="text"
                error={!!error}
                helperText={error?.message}
                placeholder={placeHolder}
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

                className={classes}
              />
            )}
          />
        </>
    );
}

