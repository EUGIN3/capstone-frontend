import React from 'react'

import logo from './assets/estrope-logo.png'

import './styles/Navbar.css'

import { useNavigate, Link } from 'react-router-dom'


const Navbar = () => {
  const navigate = useNavigate()  

  return (
    <header className='landing-header'>
        <img src={logo} alt="logo" />

        <nav>
          <a href="#home">HOME</a>
          <a href="#about">ABOUT</a>
          <a href="#gallery">GALLERY</a>
          <a href="#contact">CONTACTS</a>
        </nav>

        <div className="nav-button-container">
            <button className="button unfill-button" onClick={() => navigate(`/login`)}>Sign in</button>
            <button className="button" onClick={() => navigate(`/register`)}>Sign up</button>
        </div>
    </header>
  )
}

export default Navbar