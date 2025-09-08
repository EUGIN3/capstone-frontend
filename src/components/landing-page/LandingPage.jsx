import React from 'react'

import curlyArrow from './assets/curly-arrow.png' 

import './styles/LandingPage.css'

import Navbar from './Navbar'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import Gallery from './Gallery'

import { Link, Navigate } from 'react-router-dom'

const LandingPage = () => {
  return (    
    <div className='landingPage'>
      <Navbar />
      
      <section id="home">
        <Home />
      </section>

      <section id="about">
        <About />
      </section>

      {/* <section id="gallery">
        <Gallery />
      </section> */}

      <section id="contact">
        <Contact />
      </section>

      <Link target="" className="book-now" to='/login'>
          <p>Book now</p>
          <img src={curlyArrow} alt="Clickable arrow to get to the appointment system."/>
      </Link>
    </div>
  )
}

export default LandingPage