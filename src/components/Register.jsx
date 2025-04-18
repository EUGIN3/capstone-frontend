import './styles/LoginRegistration.css'
import '../index.css'
import React from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form'

import NormalTextField from './forms/NormalTextField'
import MyPassField from './forms/PassTextField'
import ButtonElement from './forms/ButtonElement'

import AxiosInstance from './AxiosInstance'

import logo from '../assets/estrope-logo.png'

function Register() {
    const navigate = useNavigate()
    const { handleSubmit, control } = useForm()

    const submission = (data) => {
        AxiosInstance.post(`register/`, {
            email : data.email,
            password : data.password,
        })
        .then(() => {   
            navigate(`/login`)
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
                                Welcome!
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

                        <div className="button-container">

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
