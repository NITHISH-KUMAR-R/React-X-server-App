import React, { useState, useCallback } from 'react';
import Navbar from '../Component/Navbar';
import './home.css';
import { baseurl } from '../url';

const Homepage=() => {
    const [postMessage, setPostMessage]=useState( '' );
    const [successMessage, setSuccessMessage]=useState( '' );

    const handleSubmit=useCallback( async ( event ) => {
        event.preventDefault();
        try {
            const token=localStorage.getItem( 'user' )? JSON.parse( localStorage.getItem( 'user' ) ).token:'';
            const response=await fetch( `${ baseurl }/msg/post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ token }` // Include the token in the Authorization header
                },
                body: JSON.stringify( { postMessage } ),
                credentials: 'include', // Include credentials with each request
            } );
            const data=await response.text();
            if ( response.ok ) {
                setSuccessMessage( 'Thought posted successfully!' );
                setPostMessage( '' ); // Clear the input field on successful post
            } else {
                setSuccessMessage( '' );
                console.error( 'Error:', data );
            }
        } catch ( error ) {
            console.error( 'Error:', error.message );
            setSuccessMessage( '' );
        }
    }, [postMessage] );

    return (
        <>
            <div className='Homecontainer'>
                <Navbar />
                <div className='home-container'>
                    <h1>Share your thoughts</h1>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={postMessage}
                            onChange={( e ) => setPostMessage( e.target.value )}
                            placeholder='Write your message here...'
                            required
                        />
                        <button type='submit'>Post</button>
                    </form>
                    {successMessage&&(
                        <p className='success-messages'>{successMessage}</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Homepage;
