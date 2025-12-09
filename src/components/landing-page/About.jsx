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
                    <h2 className='services-title'>Custom Dress Design</h2>

                    <p className="service-info">Made-to-measure dresses tailored to your style, body shape, and event. Each piece is designed with personal details that reflect your personality.</p>
                </div>

                <div className="service-container">
                    <h2 className='services-title'>Outfit Consultation</h2>

                    <p className="service-info">One-on-one guidance to help you choose the right look for any occasion. Includes color matching, fabric suggestions, and styling tips.</p>
                </div>

                <div className="service-container">
                    <h2 className='services-title'>Bridal & Formal Wear</h2>

                    <p className="service-info">Elegant custom gowns for weddings, debuts, and formal events. Designed from scratch with fittings included.</p>
                </div>
                <div className="service-container">
                    <h2 className='services-title'>Wardrobe Makeover</h2>

                    <p className="service-info">A full review and refresh of your clothing collection. We help you decide what to keep, what to update, and what styles suit you best.</p>
                </div>

                <div className="service-container">
                    <h2 className='services-title'>Made-to-Order Couples or Group Outfits</h2>

                    <p className="service-info">Coordinated designs for couples, families, barkada themes, or event crews.</p>
                </div>

                <div className="service-container">
                    <h2 className='services-title'>Fabric & Material Sourcing</h2>

                    <p className="service-info">Assistance in choosing the best fabrics and materials based on your budget and the look you want.</p>
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