import './styles/LoginRegistration.css'
import React from 'react'

import {Link} from 'react-router-dom'

import NormalTextField from './forms/NormalTextField'
import PassTextField from './forms/PassTextField'
import ButtonElement from './forms/ButtonElement'

import logo from '../assets/estrope-logo.png'

function Login() {
  return (
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
                            classes='email'
                            placeHolder='email@gmail.com'
                        />

                        <PassTextField
                            label='Password'
                            classes='password'
                        />
                    </div>

                    <div className="button-container">

                        <div className="btn-con">
                            <ButtonElement
                                label='LOGIN'
                                variant='filled-black'
                            />
                        </div>

                        <p>Don’t have an account? <Link to='/register' className='blue'>Register here.</Link></p>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Login
