import React, { useState, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'; // Import the custom CSS
import { baseurl } from "../url";
import axiosInstance from "../axiosConfig";

axios.defaults.withCredentials=true; // Ensure cookies are sent with each request

const Login=() => {
    const [isLoginMode, setIsLoginMode]=useState( true );
    const [formData, setFormData]=useState( {
        username: '',
        email: '',
        password: ''
    } );
    const [successMessage, setSuccessMessage]=useState( '' );
    const [errorMessage, setErrorMessage]=useState( '' ); // Add error message state

    const handleInputChange=useCallback( ( e ) => {
        const { name, value }=e.target;
        setFormData( prevState => ( { ...prevState, [name]: value } ) );
    }, [] );

    const navigate=useNavigate();

    const handleLogin=async () => {
        try {
            const response=await axiosInstance.post( `${ baseurl }/user/login`, {
                email: formData.email,
                password: formData.password
            } );

            localStorage.setItem( 'user', JSON.stringify( response.data ) );
            setSuccessMessage( 'Login successful! Redirecting to homepage...' );
            setErrorMessage( '' );
            setTimeout( () => {
                navigate( '/homepage' );
            }, 2000 ); // Delay for 2 seconds before redirecting
        } catch ( error ) {
            console.error( "Login error:", error );
            setErrorMessage( 'Login unsuccessful. Please check your email and password.' );
            setSuccessMessage( '' );
        }
    };

    const handleSignup=async () => {
        try {
            console.log( "Sending signup data:", {
                name: formData.username,
                email: formData.email,
                password: formData.password
            } );

            const response=await axiosInstance.post( `${ baseurl }/reg/newUserReg`, {
                name: formData.username,
                email: formData.email,
                password: formData.password
            } );

            setSuccessMessage( 'Signup successful! Redirecting to login page...' );
            setErrorMessage( '' );
            setTimeout( () => {
                window.location.reload();
                navigate( '/login' );
            }, 2000 );
        } catch ( error ) {
            console.error( "Signup error:", error );
            if ( error.response&&error.response.status===409 ) {
                // Check the specific error message from the backend
                if ( error.response.data.message==='Email already in use' ) {
                    setErrorMessage( 'Email already in use. Please use a different email.' );
                } else if ( error.response.data.message==='Username already in use' ) {
                    setErrorMessage( 'Username already in use. Please use a different username.' );
                } else {
                    setErrorMessage( 'Signup unsuccessful. Please try again.' );
                }
            } else {
                setErrorMessage( 'Signup unsuccessful. Please try again.' );
            }
            setSuccessMessage( '' );
        }
    };

    const handleSubmit=( e ) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setErrorMessage( '' ); // Clear previous error messages
        if ( isLoginMode ) {
            handleLogin();
        } else {
            handleSignup();
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <div className="login-card">
                    <h1>{isLoginMode? 'Login':'Signup'}</h1>
                    <form onSubmit={handleSubmit}>
                        {!isLoginMode&&(
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    name="username"
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                name="email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                name="password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-submit">
                            {isLoginMode? 'Login':'Signup'}
                        </button>
                    </form>
                    {successMessage&&<p className="success-message">{successMessage}</p>}
                    {errorMessage&&<p className="error-message">{errorMessage}</p>} {/* Display error message */}
                    <p className="toggle-mode" onClick={() => setIsLoginMode( !isLoginMode )}>
                        {isLoginMode? 'New User? Sign Up':'Already have an account? Login'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
