import './ForgotPassword.css'

import { React, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
// Components
import AxiosInstance from '../API/AxiosInstance'
import ButtonElement from '../forms/button/ButtonElement'
import MyPassField from '../forms/text-fields/PassTextField'
// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"


const ResetPassword = () => {
    const navigate = useNavigate()

    const schema = yup.object({
        password : yup.string().required('Enter your password.'),
                    // .min(8, 'Password must be at least 8 characters long.'),
        confirmNewPassword : yup.string().required('Re-enter your password.')
                    .oneOf([yup.ref('password'), null], 'Password do not match.'),
    });

    const { handleSubmit, control } = useForm({resolver : yupResolver(schema)})

    const {token} = useParams()


    const submission = (data) => {
        AxiosInstance.post(`api/password_reset/confirm/`, {
            password: data.password,
            token: token,
        })
        .then((response) => {
            toast.success(
                <div style={{ padding: '8px' }}>
                    Password updated successfully.
                </div>, 
                {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide,
                    closeButton: false,
                }
            );            
            
            setTimeout(() => {
                navigate('/login')
            }, 2000)
            
        })
        .catch((error) => {
            toast.error(
                <div style={{ padding: '8px' }}>
                    Failed to change password. Please ensure your current password is correct and try again.
                </div>,
                {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide,
                    closeButton: false,
                }
            );
        });
    }

    return (
        <>
            <form onSubmit={handleSubmit(submission)}>
                <div className="main-container">
                    <div className="reset-white-box">
                        <div className="title-container">
                            <p>Forgot Password</p>
                            <hr className='reset-pass-hr'/>
                        </div>

                        <div className="reset-input-container">
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

                        <div className="reset-button-container">
                            <ButtonElement 
                                label={'CHANGE PASSWORD'}
                                type={'submit'}
                                variant={'filled-black'}
                            />
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </form>
        </>
    )
}

export default ResetPassword