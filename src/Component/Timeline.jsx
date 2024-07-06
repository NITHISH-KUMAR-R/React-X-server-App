import React, { useEffect, useState } from 'react';
import Card from './Card';
import './Timeline.css';
import Navbar from './Navbar';
import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';

const Timeline=() => {
    const [posts, setPosts]=useState( [] );
    const [message, setMessage]=useState( '' );

    useEffect( () => {
        const fetchPosts=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/msg/allUserspost`, {
                    withCredentials: true
                } );
                console.log( response.data )

                console.log( 'Fetched posts:', response.data );
                if ( Array.isArray( response.data ) ) {
                    setPosts( response.data );
                    console.log( response.data )

                } else {
                    console.error( 'Error: Data is not an array', response.data );
                }
            } catch ( error ) {
                console.error( 'Error while fetching posts', error );
                setMessage( 'An error occurred while fetching posts.' );
            }
        };

        fetchPosts();
    }, [] );

    const likePost=async ( postId ) => {
        console.log( "helo climg" )
        try {
            const response=await axiosInstance.post( `${ baseurl }/heart/likes/${ postId }` );
            console.log( `Liked post with ID: ${ postId }`, response );

            if ( response.status===200 ) {
                const updatedPost=response.data.post;
                setPosts( prevPosts =>
                    prevPosts.map( post =>
                    ( {
                        ...post,
                        messagesList: post.messagesList.map( message =>
                            message._id===postId
                                ? { ...message, likes: updatedPost.likes }
                                :message
                        )
                    } )
                    )
                );
                setMessage( 'Post liked successfully.' );
            }
        } catch ( error ) {
            console.error( `Error liking post with ID: ${ postId }`, error );
            setMessage( 'An error occurred while liking the post.' );
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
            {message&&<p className='message'>{message}</p>}
            {posts.map( post =>
                post.messagesList.map( message => (
                    <Card
                        key={message._id}
                        username={post.username.toUpperCase()}
                        userPost={message.userPost}
                        likes={message.likes}
                        disLikes={message.disLikes}
                        date={formatDate( message.date )}
                        onLike={() => likePost( message._id )}

                    />
                ) )
            )}
        </div>
    );
};

export default Timeline;
