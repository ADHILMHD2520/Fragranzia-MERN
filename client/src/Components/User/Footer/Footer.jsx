import React from 'react'
import './Footer.css'

import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube
} from "react-icons/fa";

import {
    MdOutlineEmail,
    MdOutlinePhone
} from "react-icons/md";


const Footer = () => {

    return (
        <footer className="footer">

            <div className="footer-container">

                {/* BRAND */}
                <div className="footer-brand">

                    <h2>Fragranzia</h2>

                    <p>
                        Discover timeless fragrances crafted
                        to make every moment unforgettable.
                    </p>

                    <div className="footer-socials">

                        <a href="#">
                            <FaFacebookF />
                        </a>

                        <a href="#">
                            <FaInstagram />
                        </a>

                        <a href="#">
                            <FaTwitter />
                        </a>

                        <a href="#">
                            <FaYoutube />
                        </a>

                    </div>

                </div>


                {/* QUICK LINKS */}
                <div className="footer-column">

                    <h3>Quick Links</h3>

                    <a href="#">Home</a>
                    <a href="#">Products</a>
                    <a href="#">Gifting</a>
                    <a href="#">About</a>

                </div>


                {/* INFORMATION */}
                <div className="footer-column">

                    <h3>Information</h3>

                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Shipping Policy</a>
                    <a href="#">Return Policy</a>

                </div>


                {/* CONTACT */}
                <div className="footer-column">

                    <h3>Contact Us</h3>

                    <p className="footer-contact">
                        <MdOutlineEmail />
                        support@fragranzia.com
                    </p>

                    <p className="footer-contact">
                        <MdOutlinePhone />
                        +91 98765 43210
                    </p>

                </div>

            </div>


            {/* BOTTOM */}

            <div className="footer-bottom">

                <div className="footer-bottom-links">
                    <a href="#">Web Accessibility</a>
                    <span>|</span>

                    <a href="#">Terms of Use</a>
                    <span>|</span>

                    <a href="#">Privacy Statement</a>
                    <span>|</span>

                    <a href="#">Contact Us</a>
                </div>

                <p className="footer-copyright">
                    © 2024 Fragranzia Company. All rights reserved.
                </p>

            </div>

        </footer>
    )
}


export default Footer