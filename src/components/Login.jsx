import '../index.css'
import './styles/LoginRegistration.css'
import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import AlertComponent from './Alert'

import NormalTextField from './forms/NormalTextField'
import PassTextField from './forms/PassTextField'
import ButtonElement from './forms/ButtonElement'

import AxiosInstance from './AxiosInstance'

import logo from '../assets/estrope-logo.png'
import curlyArrowLogRes from '../assets/curly-arrow.png'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

function Login() {    
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const navigate = useNavigate()  

    const schema = yup.object({
        email : yup.string().email('Invalid email.').required('Email field is required.'),
        password : yup.string().required('Please enter your password.'),
    });

    const { handleSubmit, control } = useForm({resolver : yupResolver(schema)})

    const submission = (data) => {
        AxiosInstance.post(`login/`, {
            email : data.email,
            password : data.password,
        })
        .then((response) => { 
            setAlertMessage('Login successful. You will be redirected shortly.');
            setAlertType('success');
            setShowAlert(true);
            sessionStorage.setItem("Token", response.data.token)
            
            getUserAuthorization();

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
            const { is_staff } = response.data;

            sessionStorage.setItem('IsAdmin', is_staff);
          })
          .catch((error) => {
            console.error('Failed to fetch user authorization:', error);
          });
      };

    return (
        <form onSubmit={handleSubmit(submission)}>

            { showAlert && <AlertComponent message={alertMessage} type={alertType} show={showAlert} isNoNavbar={'alert-log-reg'}/> }

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

                        <div className="login-input-container">
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

                        <div className="logres-button-container">

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


                    <Link target="" className="arrow-resgister-login" to='/register'>
                        <p>Register</p>
                        <img src={curlyArrowLogRes} alt="Clickable arrow to get to the appointment system."/>
                    </Link>
                </div>
            </div>
        </form>
    )
}

export default Login
