import './ForgotPassword.css'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
// Components
import AxiosInstance from '../API/AxiosInstance';
import ButtonElement from '../forms/button/ButtonElement';
import NormalTextField from '../forms/text-fields/NormalTextField';
// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"


const RequestResetPassword = () => {
    const schema = yup.object({
        email : yup.string().email('Invalid email.').required('Enter your email.'),
    });

    const { handleSubmit, control } = useForm({resolver : yupResolver(schema)})

    const submission = (data) => {
        AxiosInstance.post(`api/password_reset/`, {
            email: data.email,
        })
        .then((response) => {
            toast.success(
                <div style={{ padding: '8px' }}>
                    A password reset link has been sent to your email. Please check your inbox.
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
        })
        .catch((error) => {
            toast.error(
                <div style={{ padding: '8px' }}>
                    Failed to send password reset email. Please make sure the email address is correct.
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
                            <NormalTextField 
                                label='Email'
                                name={'email'}
                                control={control}
                                classes='email'
                                placeHolder='email@gmail.com'
                            />
                        </div>

                        <div className="reset-button-container">
                            <ButtonElement 
                                label={'REQUEST'}
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

export default RequestResetPassword