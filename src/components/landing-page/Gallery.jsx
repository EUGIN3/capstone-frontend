import React from 'react'

import './styles/Gallery.css'

import attire from './assets/attire.png'
import arrowRight from './assets/arrow-right.png'
import arrowLeft from './assets/arrow-left.png'

const Gallery = () => {
  return (
        <section className="gallery-section" id="gallery">
            <div className="gallery-main-container">
                <div className="gallery-attires-container">
                    <div className="gallery-container">
                        <img className="attire" src={attire} alt="Image of asuit."/>
                    </div>
                </div>
                
                <div className='gallery-bottom-container' >
                    <div className="arrow-left-con">
                        <img src={arrowLeft} alt="arrow-left"/>
                    </div>

                    <div className="suit-name-con">
                        <p>SUIT NAME</p>
                    </div>
                    
                    <div className="arrow-right-con">
                        <img src={arrowRight} alt="arrow-left"/>
                    </div>
                </div>  
            </div>
        </section>
  )
}

export default Gallery