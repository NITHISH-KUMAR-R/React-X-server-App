
import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Timeline.css';
import Navbar from './Navbar';
import './About.css'
import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';


const About=() => {
    const [posts, setPosts]=useState( [] );
    const [username, setUsername]=useState( '' );

    useEffect( () => {
        const fetchUserPosts=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/msg/all`, {
                    withCredentials: true // Ensure credentials are included
                } );

                setUsername( response.data.username )

                // Check if messagesList exists in response.data and is an array
                if ( response.data&&Array.isArray( response.data.messagesList ) ) {
                    setPosts( response.data.messagesList||[] );
                } else {
                    console.error( 'Error: messagesList is not an array in response data' );
                }
            } catch ( error ) {
                console.error( 'Error while fetching posts', error );
            }
        };

        fetchUserPosts();
    }, [] ); // Empty dependency array ensures useEffect runs only once

    return (
        <div className="about-container">
            <Navbar />

            <h1 className="about-title">Login: {username.toUpperCase()}</h1>
            <div className="cards-container">
                {posts.map( post => (
                    <Card
                        username={username.toUpperCase()}
                        key={post._id} // Assuming _id is a unique identifier for each post
                        userPost={post.userPost} // Assuming userPost is the main content of the post
                        likes={post.likes}
                        disLikes={post.disLikes}
                        date={post.date}
                    />
                ) )}
            </div>
        </div>
    );
};

export default About;
