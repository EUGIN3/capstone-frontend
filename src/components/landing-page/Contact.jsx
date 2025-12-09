import React from 'react'

import './styles/Contact.css'

import BasicTextFields from '../forms/standard-text-field/StandardTextField'
import MultilineTextFields from '../forms/multilines-textfield/MultilineTextFields'

import gown from './assets/gown.png'
import facebook from './assets/facebook.png'
import instagram from './assets/instagram.png'
import messenger from './assets/messenger.png'
import gps from './assets/gps.png'

import { useNavigate, Link } from 'react-router-dom'

const Contact = () => {
  const navigate = useNavigate() 
  return (
    <section className="contacts-section">


      <div className="contact-main-container">
        <div className="contact-info-container">
          <p className="contact-question">Do you have a questions?</p>
          <p className="contact-info-text">Stay connected with your fashion designer — whether you have a question, an idea, or you're ready to bring your dream design to life, send a message and let’s create something timeless together.</p>
          
          <div className="socials-container">
            <button className="contact-btn" onClick={() => navigate(`/`)}>EXPLORE NOW</button>
            <div className="socials">
              <img src={facebook} alt="" />
            </div>
            <div className="socials">
              <img src={instagram} alt="" />
            </div>
            <div className="socials">
              <img src={messenger} alt="" />
            </div>
            <div className="socials">
              <img src={gps} alt="" />
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <div className="contact-form">
            <p className="contact-form-title">Contact Us</p>

            <BasicTextFields 
              label={"Name"}
              className={"input"}/>
              
            <BasicTextFields 
              label={"Email"} 
              className={"input"}/>

            <MultilineTextFields 
              label={"Message"}
              className={"input"}/>
              
            <button className="contact-btn">Send</button>
          </div>
        </div>
      </div>


      <div className="contact-bg-container">
        <img src={gown} className="contact-bg-image" alt="Image of a gown."/>
      </div>

    </section>
  )
}

export default Contact