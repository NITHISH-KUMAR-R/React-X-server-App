// src/Component/FriendPosts.js
import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Card.css';
import Navbar from './Navbar';
import { baseurl } from '../url';
import axios from 'axios';
import axiosInstance from '../axiosConfig';
// import './LoadingSpinner.css'; // Import your loading spinner CSS file

axios.defaults.withCredentials=true;

const FriendPosts=() => {
    const [friendPosts, setFriendPosts]=useState( [] );
    const [loading, setLoading]=useState( true );

    useEffect( () => {
        const fetchFriendPosts=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/msg/displayFrndPost`, {
                    withCredentials: true
                } );
                setFriendPosts( response.data.friendPosts||[] );
                setLoading( false );
            } catch ( error ) {
                console.error( 'Error fetching friend posts:', error );
                setLoading( false );
            }
        };

        fetchFriendPosts();
    }, [] );

    const formatDate=( dateString ) => {
        const options={ year: 'numeric', month: 'long', day: 'numeric' };
        const date=new Date( dateString );
        return date.toLocaleDateString( undefined, options );
    };

    return (
        <div className='card-container'>
            <Navbar />

            {loading&&(
                <div className="loading-spinner"></div>
            )}

            {!loading&&friendPosts.length===0&&(
                <p>No friend posts available.</p>
            )}

            {!loading&&friendPosts.length>0&&(
                friendPosts.map( post => (
                    post.messagesList.map( message => (
                        <Card
                            key={message._id}
                            username={post.username.toUpperCase()}
                            userPost={message.userPost}
                            likes={message.likes}
                            disLikes={message.disLikes}
                            date={formatDate( message.date )}
                        />
                    ) )
                ) )
            )}
        </div>
    );
};

export default FriendPosts;
