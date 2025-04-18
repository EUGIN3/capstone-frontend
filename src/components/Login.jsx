import '../index.css'
import './styles/LoginRegistration.css'
import React from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'

import NormalTextField from './forms/NormalTextField'
import PassTextField from './forms/PassTextField'
import ButtonElement from './forms/ButtonElement'

import AxiosInstance from './AxiosInstance'

import logo from '../assets/estrope-logo.png'

function Login() {
    const navigate = useNavigate()
    const { handleSubmit, control } = useForm()

    const submission = (data) => {
        AxiosInstance.post(`login/`, {
            email : data.email,
            password : data.password,
        })
        .then((response) => {
            sessionStorage.setItem("Token", response.data.token)
            navigate(`/home`)
        })
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
