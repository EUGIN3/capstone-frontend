import React from 'react'

import './styles/Home.css'

import bilog from './assets/Ellipse 1.png';

import { useNavigate, Link } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()  
  return (
    <section className="section" id="home">
        <div className="home-info">

            <h2 className="animated-text"><span></span></h2>
            <p>From fabric to silhouette, every detail tells a story. Explore the artistry behind each piece designed to reflect who you are — bold, beautiful, and unapologetically unique.</p>

            <button className="home-btn" onClick={() => navigate(`/`)}>EXPLORE NOW</button>
        </div>

        <div className="backdrop-container">
          <img className="backdrop" src={bilog} alt="" />
        </div>
    </section>
  )
}

export default Home