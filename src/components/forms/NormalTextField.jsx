import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function NormalTextField(props) {
    const {label, classes, placeHolder, name, control} = props

    return (
        <>  
            <TextField 
                id="outlined-search" 
                label={label}
                type="text"
                placeholder={placeHolder}
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

                  className={classes}
                  name={name}
                  control={control}
            />
        </>
    );
}

