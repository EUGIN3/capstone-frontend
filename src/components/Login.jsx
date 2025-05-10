import '../index.css'
import './styles/LoginRegistration.css'
import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'

import AlertComponent from './Alert'

import NormalTextField from './forms/NormalTextField'
import PassTextField from './forms/PassTextField'
import ButtonElement from './forms/ButtonElement'

import AxiosInstance from './AxiosInstance'

import logo from '../assets/estrope-logo.png'

function Login() {
    const navigate = useNavigate()
    const { handleSubmit, control } = useForm()

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');


    const submission = async (data) => {
        AxiosInstance.post(`login/`, {
            email : data.email,
            password : data.password,
        })
        .then((response) => {
            setAlertMessage('Login successful. You will be redirected shortly.');
            setAlertType('success');
            setShowAlert(true);
            sessionStorage.setItem("Token", response.data.token)
            
            getUserAuthorization()
            setTimeout(() => {
                setShowAlert(false);
                navigate(`/`)
            }, 1000);
        })
        .catch((error) => {
            setAlertMessage('Login failed. Please check that your email and password are correct.');
            setAlertType('error');
            setShowAlert(true);
      
            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
        });
    }

    const getUserAuthorization = () => {
        AxiosInstance.get('profile/')
          .then((response) => {
            const { is_staff, is_superuser } = response.data;

            sessionStorage.setItem('UserIsStaff', is_staff);
            sessionStorage.setItem('UserIsSuper', is_superuser);
          })
          .catch((error) => {
            console.error('Failed to fetch user authorization:', error);
          });
      };

    return (
        <form onSubmit={handleSubmit(submission)}>

            { showAlert && <AlertComponent message={alertMessage} type={alertType} show={showAlert} /> }

            <div className={'main-login'}>
                <div className="black-side">
                    <img src={logo} alt="Ramil Estrope's logo" className='logo'/>

                    <p className="logo-name">Ramil Estrope</p>
                    <p className="logo-profession">Fashion Designer</p>
                </div>

                <div className="white-side">
                    <div className="white-container">
                        <div className="info-container">
                            <p className="welcome">
                                Welcome back!
                            </p>

                            <p className="welcome-message">
                                Connect with us and make your design possible for the world to be seen.
                            </p>
                        </div>

                        <div className="input-container">
                            <NormalTextField 
                                label='Email'
                                name={'email'}
                                control={control}
                                classes='email'
                                placeHolder='email@gmail.com'
                            />

                            <PassTextField
                                label='Password'
                                name={'password'}
                                control={control}
                                classes='password'
                            />
                        </div>

                        <Link to='/request-reset-password' className='blue forgot-password'>Forgot password.</Link>

                        <div className="button-container">

                            <div className="btn-con">
                                <ButtonElement
                                    label='LOGIN'
                                    variant='filled-black'
                                    type={'submit'}
                                />
                            </div>

                            <p>Don’t have an account? <Link to='/register' className='blue'>Register here.</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Login
