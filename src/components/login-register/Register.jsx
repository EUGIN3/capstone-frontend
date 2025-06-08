import './LoginRegistration.css'

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
// Components
import NormalTextField from '../forms/text-fields/NormalTextField'
import MyPassField from '../forms/text-fields/PassTextField'
import ButtonElement from '../forms/button/ButtonElement'
import AxiosInstance from '../API/AxiosInstance'
// Images
import logo from '../../assets/estrope-logo.png'
import curlyArrowLogRes from '../../assets/curly-arrow.png'
// Toast
import { ToastContainer, toast, Slide } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"

function Register() {
    const navigate = useNavigate()
    
    const schema = yup.object({
        fname : yup.string().required('Enter your first name.'),
        lname : yup.string().required('Enter your last name.'),
        pnumber : yup.string().required('Enter your contact number.'),
        email : yup.string().email('Invalid email.').required('Enter your email.'),
        password : yup.string().required('Enter your password.'),
                    // .min(8, 'Password must be at least 8 characters long.'),
        confirmPassword : yup.string().required('Re-enter your password.')
                    .oneOf([yup.ref('password'), null], 'Password do not match.'),
    });

    const { handleSubmit, control } = useForm({resolver : yupResolver(schema)})


    const submission = (data) => {
        AxiosInstance.post(`auth/register/`, {
            first_name : data.fname,
            last_name : data.lname,
            address : data.address,
            phone_number : data.pnumber,
            facebook_link : data.fblink,
            email : data.email,
            password : data.password,
        })
        .then(() => {
            toast.success(
                <div style={{ padding: '8px' }}>
                    Registration successful. You can now log in to your account.
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
                navigate(`/login`)
              }, 2000);
              
        })
        .catch((error) => {
            toast.error(
                <div style={{ padding: '8px' }}>
                    Registration failed. Please check your information and try again.
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
        <form onSubmit={handleSubmit(submission)}>
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
                                Welcome!
                            </p>

                            <p className="welcome-message">
                                Connect with us and make your design possible for the world to be seen.
                            </p>
                        </div>

                        <div className="register-input-container">
                            <div className="resgister-name-input-con">
                                <NormalTextField 
                                    label='First Name'
                                    name={'fname'}
                                    control={control}
                                    classes='fname'
                                    placeHolder='First Name'
                                />

                                <NormalTextField 
                                    label='Last Name'
                                    name={'lname'}
                                    control={control}
                                    classes='lname'
                                    placeHolder='Last Name'
                                />
                            </div>

                            <div className="resgister-contact-input-con">
                                <NormalTextField 
                                    label='Phone Number'
                                    name={'pnumber'}
                                    control={control}
                                    classes='pnumber'
                                    placeHolder='09********9'
                                />

                                <NormalTextField 
                                    label='Facebook Link'
                                    name={'fblink'}
                                    control={control}
                                    classes='fblink'
                                    placeHolder='Facebook Link'
                                />
                            </div>

                            <NormalTextField 
                                label='Adress'
                                name={'address'}
                                control={control}
                                classes='address'
                                placeHolder='Brgy. 1, Lucena City'
                            />

                            <NormalTextField 
                                label='Email'
                                name={'email'}
                                control={control}
                                classes='email'
                                placeHolder='email@gmail.com'
                            />

                            <MyPassField
                                label='Password'
                                name={'password'}
                                control={control}
                                classes='password'
                            />

                            <MyPassField
                                label='Confirm password'
                                name={'confirmPassword'}
                                control={control}
                                classes='password'
                            />
                        </div>

                        <div className="logres-button-container">

                            <div className="btn-con">
                                <ButtonElement
                                    label='SIGN UP'
                                    type={'submit'}
                                    variant='filled-black'
                                />
                            </div>

                            <p>Already have an account? <Link to='/login' className='blue'>Please login.</Link></p>
                        </div>
                    </div>

                    <Link target="" className="arrow-resgister-login" to='/login'>
                        <p>Log in</p>
                        <img src={curlyArrowLogRes} alt="Clickable arrow to get to the appointment system."/>
                    </Link>
                </div>
            </div>

            <ToastContainer />
        </form>
    )
}

export default Register
