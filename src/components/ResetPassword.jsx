import React from 'react'
import ButtonElement from './forms/ButtonElement'
import MyPassField from './forms/PassTextField'

import './styles/ForgotPassword.css'
import '../index.css'

const ResetPassword = () => {
    return (
        <>
            <div className="main-container">
                <div className="white-box">
                    <div className="title-container">
                        <p>Forgot Password</p>
                        <hr className='reset-pass-hr'/>
                    </div>

                    <div className="input-container">
                        <MyPassField
                            label='New password'
                            name={'newPassword'}
                            control={control}
                            classes='password'
                        />

                        <MyPassField
                            label='Confirm new password'
                            name={'confirmNewPassword'}
                            control={control}
                            classes='password'
                        />
                    </div>

                    <div className="button-container">
                        <ButtonElement 
                            label={'CHANGE PASSWORD'}
                            type={'submit'}
                            variant={'filled-black'}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword