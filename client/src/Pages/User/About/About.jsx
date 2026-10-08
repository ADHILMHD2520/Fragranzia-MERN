import React from 'react'
import { Link } from 'react-router-dom'

import './About.css'

import AboutImage from "../../../assets/About.png";


import Navbar from '../../../Components/User/Navbar/Navbar';
import Footer from "../../../Components/User/Footer/Footer";

const About = () => {
    return (
        <div>
            <Navbar/>

            <div className="full-about">
                <div className="left-about">
                    <h1>About Fragraniza</h1>
                    <h5>
                        <Link to="/">
                            Home
                        </Link>
                        {' > '}
                        <Link to="/about">
                            About
                        </Link>
                    </h5>

                    <div className="para-text">
                        <p>
                            At Fragranzia, we believe that a perfume is more than just a scent—it's a story, an art, and a
                            science combined to create memories that linger. Our journey began with a vision to craft exquisite
                            fragrances that capture the essence of individuality and elevate every moment into something
                            timeless.
                            <br /><br />
                            Guided by passion and precision, we source the finest ingredients from around the
                            world to create perfumes that resonate with authenticity and luxury. Each bottle is a masterpiece,
                            meticulously crafted to deliver an unparalleled sensory experience.
                            <br /><br />
                            Our commitment goes beyond creating fragrances. We aim to inspire confidence, evoke emotions,
                            and celebrate uniqueness through every drop we produce. Fragranzia isn’t just a brand—it’s a
                            celebration of you, your style, and your moments.
                            <br /><br />
                            With a legacy built on quality, artistry, and innovation, we invite you to explore
                            our collection and find a scent that speaks your story..
                        </p>
                    </div>
                </div>

                <div className="about-img">
                    <img src={AboutImage} alt="Fragranzia perfumes" />
                </div>
            </div>

            <Footer/>
        </div>
    )
}

export default About