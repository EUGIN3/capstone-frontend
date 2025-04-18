import React from 'react'
import ButtonElement from './forms/ButtonElement'
import MyPassField from './forms/PassTextField'

import { useNavigate, useParams } from 'react-router-dom'

import { useForm } from 'react-hook-form'

import AxiosInstance from './AxiosInstance'

import './styles/ForgotPassword.css'
import '../index.css'

const ResetPassword = () => {
    const navigate = useNavigate()
    const { handleSubmit, control } = useForm()
    const {token} = useParams()

    const submission = (data) => {
        AxiosInstance.post(`api/password_reset/confirm/`, {
            password: data.password,
            token: token,
        })

        .then((response) => {
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit(submission)}>
                <div className="main-container">
                    <div className="white-box">
                        <div className="title-container">
                            <p>Forgot Password</p>
                            <hr className='reset-pass-hr'/>
                        </div>

                        <div className="input-container">
                            <MyPassField
                                label='New password'
                                name={'password'}
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
            </form>
        </>
    )
}

export default ResetPassword