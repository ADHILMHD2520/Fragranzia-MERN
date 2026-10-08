import React, { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify";
import {
    FaGoogle,
    FaFacebookF,
    FaUser,
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import './SignUp.css';
import { Link } from "react-router-dom";


const SignUp = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // formdata
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    // Runs when Sign Up form is submitted
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/register",
                formData
            );

            toast.success(response.data.message);

            // Clear the form
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
            console.error(error);
        }
    };


    return (

        <div className="main">


            {/* LEFT SIDE */}
            <div className="banner">

                <h1>Let's Get Started!</h1>

                <p>
                    Create your account and unlock the
                    <br />
                    full potential of Fragranzia.
                </p>

            </div>



            {/* RIGHT SIDE */}
            <div className="right">


                {/* SOCIAL BUTTONS */}
                <div className="social">

                    <button type="button">

                        <FaGoogle className="google-icon" />

                        Google

                    </button>


                    <button type="button">

                        <FaFacebookF className="facebook-icon" />

                        Facebook

                    </button>

                </div>



                {/* DIVIDER */}
                <div className="signup-text">

                    <hr />

                    <span>
                        Or sign up with email
                    </span>

                    <hr />

                </div>



                {/* FORM */}

                <form onSubmit={handleSubmit}>


                    {/* USERNAME */}
                    <div className="input-box">

                        <FaUser className="input-icon" />

                        <input
                            type="text"
                            name='name'
                            placeholder="Enter your username"
                            value={formData.name}
                            onChange={handleChange}

                        />

                    </div>



                    {/* EMAIL */}
                    <div className="input-box">

                        <FaEnvelope className="input-icon" />

                        <input
                            type="email"
                            name='email'
                            placeholder="Enter your E-Mail"
                            value={formData.email}
                            onChange={handleChange}
                        />

                    </div>



                    {/* PASSWORD */}
                    <div className="input-box">

                        <FaLock className="input-icon" />

                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />


                        <button
                            type="button"
                            className="eye-button"
                            onClick={() =>
                                setShowPassword(!showPassword)
                            }
                        >

                            {showPassword
                                ? <FaEye />
                                : <FaEyeSlash />
                            }

                        </button>

                    </div>



                    {/* CONFIRM PASSWORD */}
                    <div className="input-box">

                        <FaLock className="input-icon" />

                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />


                        <button
                            type="button"
                            className="eye-button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                        >

                            {showConfirmPassword
                                ? <FaEye />
                                : <FaEyeSlash />
                            }

                        </button>

                    </div>



                    {/* TERMS */}
                    <div className="terms">

                        <input
                            type="checkbox"
                            id="terms"
                        />


                        <label htmlFor="terms">

                            Agree with{" "}

                            <a href="#">
                                Terms & Conditions
                            </a>

                        </label>

                    </div>



                    {/* SIGN UP BUTTON */}
                    <button
                        type="submit"
                        className="btn"
                    >

                        Sign up

                    </button>


                </form>



                {/* GO TO SIGN IN */}

                <div className="signin">

                    Already have an account?{" "}

                    <Link to="/signin">
                        Sign In
                    </Link>

                </div>


            </div>

        </div>

    );
};


export default SignUp;