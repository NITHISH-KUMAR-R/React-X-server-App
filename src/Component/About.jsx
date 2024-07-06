import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Timeline.css';
import Navbar from './Navbar';
import './About.css';
import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';

const About=() => {
    const [posts, setPosts]=useState( [] );
    const [username, setUsername]=useState( '' );
    const [message, setMessage]=useState( '' );

    useEffect( () => {
        const fetchUserPosts=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/msg/all`, {
                    withCredentials: true // Ensure credentials are included
                } );



                setUsername( response.data.username );

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
    }, [] );

    const likePost=async ( postId ) => {
        try {
            const response=await axiosInstance.post( `${ baseurl }/heart/likes/${ postId }` );


            if ( response.status===200 ) {
                const updatedPost=response.data.post;
                setPosts( ( prevPosts ) =>
                    prevPosts.map( ( post ) =>
                        post._id===postId? { ...post, likes: updatedPost.likes }:post
                    )
                );
                setMessage( 'Post updated successfully.' );
            }
        } catch ( error ) {
            console.error( `Error liking post with ID: ${ postId }`, error );
            setMessage( 'An error occurred while liking the post.' );
        }
    };

    const dislikePost=async ( postId ) => {
        try {
            const response=await axiosInstance.post( `${ baseurl }/heart/dislike/${ postId }` );

            if ( response.status===200 ) {
                const updatedPost=response.data.post;
                setPosts( ( prevPosts ) =>
                    prevPosts.map( ( post ) =>
                        post._id===postId? { ...post, disLikes: updatedPost.disLikes }:post
                    )
                );
                setMessage( 'Post updated successfully.' );
            }
        } catch ( error ) {
            console.error( `Error disliking post with ID: ${ postId }`, error );
            setMessage( 'An error occurred while disliking the post.' );
        }
    };

    return (
        <div className="about-container">
            <Navbar />
            <h1 className="about-title">Login: {username.toUpperCase()}</h1>
            {message&&<p className="message">{message}</p>}
            <div className="cards-container">
                {posts.map( ( post ) => (
                    <Card
                        username={username.toUpperCase()}
                        key={post._id} // Assuming _id is a unique identifier for each post
                        userPost={post.userPost} // Assuming userPost is the main content of the post
                        likes={post.likes}
                        disLikes={post.disLikes}
                        date={post.date}
                        onLike={() => likePost( post._id )} // Pass the likePost function with the postId
                        onDislike={() => dislikePost( post._id )} // Pass the dislikePost function with the postId
                    />
                ) )}
            </div>
        </div>
    );
};

export default About;
