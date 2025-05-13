import { React, useState } from 'react'
import ButtonElement from '../forms/ButtonElement'
import MyPassField from '../forms/PassTextField'

import { useNavigate, useParams } from 'react-router-dom'

import AxiosInstance from '../AxiosInstance'

import AlertComponent from '../Alert'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import '../styles/ForgotPassword.css'
import '../../index.css'

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

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const submission = (data) => {
        AxiosInstance.post(`api/password_reset/confirm/`, {
            password: data.password,
            token: token,
        })
        .then((response) => {
            setAlertMessage('Password updated successfully.');
            setAlertType('success');
            setShowAlert(true);

            setTimeout(() => {
                setShowAlert(false);
                navigate('/login')
            }, 1000)
        })
        .catch((error) => {
            setAlertMessage('Failed to change password. Please ensure your current password is correct and try again.');
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
            </form>
        </>
    )
}

export default ResetPassword