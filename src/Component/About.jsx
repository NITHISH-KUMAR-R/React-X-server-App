
import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Timeline.css';
import Navbar from './Navbar';
import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';

const About=() => {
    const [posts, setPosts]=useState( [] );

    useEffect( () => {
        const fetchUserPosts=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/msg/all`, {
                    withCredentials: true // Ensure credentials are included
                } );
                console.log( response );

                // Check if messagesList exists in response.data and is an array
                if ( response.data&&Array.isArray( response.data.messagesList ) ) {
                    setPosts( response.data.messagesList );
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
        <div className="card-container">
            <Navbar />
            <h2>Logged User's Posts Only</h2>
            {posts.map( post => (
                <Card
                    key={post._id} // Assuming _id is a unique identifier for each post
                    userPost={post.userPost} // Assuming userPost is the main content of the post
                    likes={post.likes}
                    disLikes={post.disLikes}
                    date={post.date}
                />
            ) )}
        </div>
    );
};

export default About;
