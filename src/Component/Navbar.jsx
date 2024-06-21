import React, { useState, useEffect, useRef } from 'react';
import './navbar.css'; // Import custom CSS for styling
import { Link, useLocation } from 'react-router-dom';
import logo from './notebook.gif'; // Import your logo image

import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';

const Navbar=() => {
    const [menuOpen, setMenuOpen]=useState( false );
    const navRef=useRef( null ); // Ref to access the nav element
    const location=useLocation(); // Get current location using useLocation hook

    const handleLogout=async () => {
        try {
            await axiosInstance.post( `${ baseurl }/user/logout`, {
                withCredentials: true // Send cookies with the request
            } );
            localStorage.removeItem( 'user' ); // Remove user session data
            window.location.href='/login'; // Redirect to login page
        } catch ( error ) {
            console.error( 'Logout error:', error );
            // Handle error if needed
        }
    };

    const toggleMenu=() => {
        setMenuOpen( !menuOpen );
    };

    // Close menu when clicking outside
    useEffect( () => {
        const handleOutsideClick=( event ) => {
            if ( navRef.current&&!navRef.current.contains( event.target ) ) {
                setMenuOpen( false );
            }
        };

        // Add event listener when menu is open
        if ( menuOpen ) {
            document.addEventListener( 'mousedown', handleOutsideClick );
        } else {
            document.removeEventListener( 'mousedown', handleOutsideClick );
        }

        // Clean up
        return () => {
            document.removeEventListener( 'mousedown', handleOutsideClick );
        };
    }, [menuOpen] );

    // Close menu if clicking on any link that is already active
    const handleClickLink=() => {
        if ( menuOpen&&location.pathname==='/homepage' ) {
            setMenuOpen( false );
        } else if ( menuOpen&&location.pathname==='/friendspost' ) {
            setMenuOpen( false );
        } else if ( menuOpen&&location.pathname==='/friend' ) {
            setMenuOpen( false );
        } else if ( menuOpen&&location.pathname==='/about' ) {
            setMenuOpen( false );
        }
    };

    return (
        <nav className="navbar" ref={navRef}>
            <div className="nav-header">
                <div className="nav-logo">
                    <Link to="/homepage">
                        <img src={logo} alt="Logo" /> {/* Use your logo image here */}
                    </Link>
                </div>
                <div className="nav-toggle" onClick={toggleMenu}>
                    <div className={`burger ${ menuOpen? 'open':'' }`}>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                </div>
            </div>
            <ul className={`nav-list ${ menuOpen? 'open':'' }`}>
                <li className="nav-item">
                    <Link to="/homepage" onClick={handleClickLink}>Home</Link>
                </li>
                <li className="nav-item">
                    <Link to="/friendspost" onClick={handleClickLink}>Timeline</Link>
                </li>
                <li className="nav-item">
                    <Link to="/friend" onClick={handleClickLink}>Friends</Link>
                </li>
                <li className="nav-item">
                    <Link to="/about" onClick={handleClickLink}>About</Link>
                </li>
                <li className="nav-item">
                    <button onClick={handleLogout}>
                        {'L'}
                        {/* <img src={logout} alt="Logout" /> */}
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
