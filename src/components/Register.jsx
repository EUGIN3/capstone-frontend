import './styles/LoginRegistration.css'
import '../index.css'
import React, { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'

import NormalTextField from './forms/NormalTextField'
import MyPassField from './forms/PassTextField'
import ButtonElement from './forms/ButtonElement'

import AlertComponent from './Alert'

import AxiosInstance from './AxiosInstance'

import logo from '../assets/estrope-logo.png'

function Register() {
    const navigate = useNavigate()
    const { handleSubmit, control } = useForm()

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');

    const submission = (data) => {
        AxiosInstance.post(`register/`, {
            first_name : data.fname,
            last_name : data.lname,
            address : data.address,
            phone_number : data.pnumber,
            facebook_link : data.fblink,
            email : data.email,
            password : data.password,
        })
        .then(() => {
            setAlertMessage('Registration successful. You can now log in to your account.');
            setAlertType('success');
            setShowAlert(true);
            
            setTimeout(() => {
                setShowAlert(false);
                navigate(`/login`)
              }, 1000);
              
        })
        .catch((error) => {
            setAlertMessage('Registration failed. Please check your information and try again.');
            setAlertType('error');
            setShowAlert(true);
      
            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
        });
    }

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
                                    label='SING UP'
                                    type={'submit'}
                                    variant='filled-black'
                                />
                            </div>

                            <p>Already have an account? <Link to='/login' className='blue'>Please login.</Link></p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Register
