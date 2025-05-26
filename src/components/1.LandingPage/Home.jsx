import React from 'react'

import './styles/Home.css'

import bigLogo from './assets/estrope-logo-big.png';
import bilog from './assets/Ellipse 1.png';

const Home = () => {
  return (
    <section id="home">
        <div className="home-main-container">
            <img src={bilog} alt="" className="light" />

            <div className='bigLogo-cotainer'>
              <img src={bigLogo} alt="Ramil Estrope's image." id="profile-ramil-image" />

              <div className="home-details-container">
                <p className="name">RAMIL ESTROPE</p>
                <p className="career">FASHION DESIGNER</p>
              </div>
            </div>
        </div>
    </section>
  )
}

export default Home