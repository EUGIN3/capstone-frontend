import React from 'react'

import './styles/About.css'

import circleAbout from './assets/circles-about.png'
import bilog from './assets/Ellipse 1.png';

const About = () => {
  return (
    <section className="about-section">
        <div className="about-main-container">
            <div className="about-name-con">
                <p className="about-name">SERVICES</p>
            </div>

            <div className="services-container">
                <div className="service-container">
                    <h2 className='services-title'>Custom Design</h2>

                    <p className="service-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                </div>

                <hr className="about-hr" />

                <div className="service-container">
                    <h2 className='services-title'>Custom Design</h2>

                    <p className="service-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                </div>

                <hr className="about-hr" />

                <div className="service-container">
                    <h2 className='services-title'>Custom Design</h2>

                    <p className="service-info">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p>
                </div>
            </div>

        </div>
        
        <div className="circle-about-container"> 
            <img src={circleAbout} alt="" />
        </div>

        <div className="about-backdrop-container">
            <img className="about-backdrop" src={bilog} alt="" />
        </div>
    </section>

  )
}

export default About