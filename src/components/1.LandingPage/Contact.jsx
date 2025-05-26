import React from 'react'

import './styles/Contact.css'

import gown from './assets/gown.png'

const Contact = () => {
  return (
    <section className="contacts-section" id="contact">
        <div className="contact-main-container">
            <img src={gown} className="contact-bg-image" alt="Image of a gown."/>

            <div className="form-container">
                <p></p>
            </div>
        </div>
    </section>
  )
}

export default Contact