import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
    FaGoogle,
    FaFacebookF,
    FaUser,
    FaLock,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import './SignUp.css';


const SignIn = () => {

    const navigate = useNavigate();


    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/login`,       //sending formData to server and wait for response
                formData
            );

            // Store JWT token
            localStorage.setItem("accessToken", response.data.token);


            // Store user role
            localStorage.setItem("role", response.data.user.role);

            // Redirect based on role
            if (response.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
            // Clear the form
            setFormData({
                email: "",
                password: "",
            });
        } catch (error) {

            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong");
            }
            console.error(error);

            navigate("/signin");
        }
    };



    return (
        <div className="main">

            <div className="banner">

                <h1>Welcome Back</h1>

                <p>
                    Glad to see you again! Access your
                    <br />
                    account to explore more.
                </p>

            </div>


            <div className="right">

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


                <div className="signup-text">

                    <hr />

                    <span>Or sign in with email</span>

                    <hr />

                </div>


                <form onSubmit={handleSubmit}>

                    <div className="input-box">

                        <FaUser className="input-icon" />

                        <input
                            type="text"
                            name='email'
                            value={formData.email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                        />

                    </div>


                    <div className="input-box">

                        <FaLock className="input-icon" />

                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <button
                            type="button"
                            className="eye-button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>

                    </div>


                    <div className="forgot-password">

                        <a href="#">
                            Forgot Password?
                        </a>

                    </div>


                    <button
                        type="submit"
                        className="btn"
                    >
                        Sign in
                    </button>

                </form>


                <div className="signin">

                    Don't have an account?{" "}

                    <Link to="/signup">
                        Sign Up
                    </Link>

                </div>

            </div>

        </div>
    );
};


export default SignIn;