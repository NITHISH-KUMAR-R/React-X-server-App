// src/Component/FriendPosts.js
import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Card.css';
import Navbar from './Navbar';
import { baseurl } from '../url';
import axios from 'axios';
import axiosInstance from '../axiosConfig';

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
                console.log( response.data );
                setFriendPosts( response.data.friendPosts||[] );
                setLoading( false );
            } catch ( error ) {
                console.error( 'Error fetching friend posts:', error );
                setLoading( false );
            }
        };

        fetchFriendPosts();
    }, [] );

    const likePost=async ( postId ) => {
        try {
            const response=await axiosInstance.post( `${ baseurl }/heart/likes/${ postId }` );
            console.log( `Liked post with ID: ${ postId }`, response );

            if ( response.status===200 ) {
                const updatedPost=response.data.post;
                setFriendPosts( ( prevPosts ) =>
                    prevPosts.map( ( post ) => ( {
                        ...post,
                        messagesList: post.messagesList.map( ( message ) =>
                            message._id===postId
                                ? { ...message, likes: updatedPost.likes }
                                :message
                        )
                    } ) )
                );
            }
        } catch ( error ) {
            console.error( `Error liking post with ID: ${ postId }`, error );
        }
    };

    const dislikePost=async ( postId ) => {
        try {
            const response=await axiosInstance.post( `${ baseurl }/heart/dislike/${ postId }` );
            console.log( `Disliked post with ID: ${ postId }`, response );

            if ( response.status===200 ) {
                const updatedPost=response.data.post;
                setFriendPosts( ( prevPosts ) =>
                    prevPosts.map( ( post ) => ( {
                        ...post,
                        messagesList: post.messagesList.map( ( message ) =>
                            message._id===postId
                                ? { ...message, disLikes: updatedPost.disLikes }
                                :message
                        )
                    } ) )
                );
            }
        } catch ( error ) {
            console.error( `Error disliking post with ID: ${ postId }`, error );
        }
    };

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
                    post.messagesList&&post.messagesList.map( message => (
                        <Card
                            key={message._id}
                            username={post.username?.toUpperCase()||'Unknown'}
                            userPost={message.userPost}
                            likes={message.likes}
                            disLikes={message.disLikes}
                            date={formatDate( message.date )}
                            onLike={() => likePost( message._id )} // Pass the likePost function with the messageId
                            onDislike={() => dislikePost( message._id )} // Pass the dislikePost function with the messageId
                        />
                    ) )
                ) )
            )}
        </div>
    );
};

export default FriendPosts;
