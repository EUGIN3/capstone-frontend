import './LoginRegistration.css'

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
// Components
import NormalTextField from '../forms/text-fields/NormalTextField.jsx'
import PassTextField from '../forms/text-fields/PassTextField'
import ButtonElement from '../forms/button/ButtonElement'
import AxiosInstance from '../API/AxiosInstance'
// Images
import logo from '../../assets/estrope-logo.png'
import curlyArrowLogRes from '../../assets/curly-arrow.png'
// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"


function Login() {
    const navigate = useNavigate()  

    const schema = yup.object({
        email : yup.string().email('Invalid email.').required('Email field is required.'),
        password : yup.string().required('Please enter your password.'),
    });

    const { handleSubmit, control } = useForm({resolver : yupResolver(schema)})

    const submission = (data) => {
        AxiosInstance.post(`auth/login/`, {
            email : data.email,
            password : data.password,
        })
        .then((response) => { 
            sessionStorage.setItem("Token", response.data.token)
            
            getUserAuthorization();
            toast.success(
                <div style={{ padding: '8px' }}>
                    Login successful. You will be redirected shortly.
                </div>, 
                {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: true,
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
                navigate(`/`)
            }, 1000);

        })
        .catch((error) => {
            toast.error(
                <div style={{ padding: '8px' }}>
                    Login failed. Please check that your email and password are correct.
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

    const getUserAuthorization = () => {
        AxiosInstance.get('auth/profile/')
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
            <div className={'main-login'}>
                <div className="black-side">
                    <img src={logo} alt="Ramil Estrope's logo" className='logo'/>

                    <p className="logo-name">Ramil Estrope</p>
                    <p className="logo-profession">Fashion Designer</p>
                </div>

                <div className="white-side">
                    <div className="login-white-container">
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

            <ToastContainer />
        </form>
    )
}

export default Login
