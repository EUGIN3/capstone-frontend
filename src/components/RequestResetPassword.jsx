import React from 'react'
import ButtonElement from './forms/ButtonElement'
import NormalTextField from './forms/NormalTextField'

import './styles/ForgotPassword.css'
import '../index.css'

const RequestResetPassword = () => {
    return (
        <>
            <div className="main-container">
                <div className="white-box">
                    <div className="title-container">
                        <p>Forgot Password</p>
                        <hr className='reset-pass-hr'/>
                    </div>

                    <div className="input-container">
                        <NormalTextField 
                            label='Email'
                            name={'email'}
                            control={control}
                            classes='email'
                            placeHolder='email@gmail.com'
                        />
                    </div>

                    <div className="button-container">
                        <ButtonElement 
                            label={'REQUEST'}
                            type={'submit'}
                            variant={'filled-black'}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default RequestResetPassword