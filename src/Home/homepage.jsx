import React, { useState, useCallback } from 'react';
import Navbar from '../Component/Navbar';
import './home.css';
import { baseurl } from '../url';

const Homepage=() => {
    const [postMessage, setPostMessage]=useState( '' );
    const [responseMessage, setResponseMessage]=useState( '' );

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
                setResponseMessage( data );
                setPostMessage( '' ); // Clear the input field on successful post
            } else {
                setResponseMessage( 'Error: '+data );
            }
        } catch ( error ) {
            setResponseMessage( 'Error: '+error.message );
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
                    {responseMessage&&<p>{responseMessage}</p>}
                </div>
            </div>
        </>
    );
};

export default Homepage;
