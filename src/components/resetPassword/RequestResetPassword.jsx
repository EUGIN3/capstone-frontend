import { React, useState } from 'react'
import ButtonElement from '../forms/ButtonElement'
import NormalTextField from '../forms/NormalTextField'

import { useNavigate } from 'react-router-dom'

import AxiosInstance from '../AxiosInstance'

import AlertComponent from '../Alert'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import '../styles/ForgotPassword.css'
import '../../index.css'

const RequestResetPassword = () => {
    const navigate = useNavigate()

    const schema = yup.object({
        email : yup.string().email('Invalid email.').required('Enter your email.'),
    });

    const { handleSubmit, control } = useForm({resolver : yupResolver(schema)})

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const submission = (data) => {
        AxiosInstance.post(`api/password_reset/`, {
            email: data.email,
        })
        .then((response) => {
            setAlertMessage('A password reset link has been sent to your email. Please check your inbox.');
            setAlertType('success');
            setShowAlert(true);
        })
        .catch((error) => {
            setAlertMessage('Failed to send password reset email. Please make sure the email address is correct.');
            setAlertType('error');
            setShowAlert(true);
      
            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
        });
        
    }

    return (
        <>
            <form onSubmit={handleSubmit(submission)}>  

                { showAlert && <AlertComponent message={alertMessage} type={alertType} show={showAlert} /> }

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
            </form>
        </>
    )
}

export default RequestResetPassword