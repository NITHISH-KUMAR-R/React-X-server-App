import React, { useEffect, useState } from 'react';

import './Friend.css';
import Friend2 from './Friend2';
import Navbar from './Navbar';
import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';

const FriendComponent=() => {
    const [session, setSession]=useState( null ); // Use null for initial state
    const [allUsers, setAllUsers]=useState( [] ); // To store all users
    const [receivedRequests, setReceivedRequests]=useState( [] ); // To store received friend requests
    const [sentRequests, setSentRequests]=useState( new Set() ); // To track sent friend requests
    const [loading, setLoading]=useState( true ); // To manage loading state

    useEffect( () => {
        const fetchLoginUserId=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/user/session`, {
                    withCredentials: true // Include credentials in the request
                } );
                const data=response.data;
                console.log( data );
                setSession( data );
            } catch ( error ) {
                console.error( 'Error fetching session data:', error );
            }
        };

        fetchLoginUserId();
    }, [] );

    useEffect( () => {
        const fetchAllUsers=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/friend/unkownuser`, {
                    withCredentials: true // Include credentials in the request
                } );
                const allUserData=response.data;
                console.log( allUserData );
                setAllUsers( allUserData );
                setLoading( false );
            } catch ( error ) {
                console.error( 'Error fetching all users:', error );
                setLoading( false );
            }
        };

        fetchAllUsers();
    }, [] );

    useEffect( () => {
        const fetchReceivedRequests=async () => {
            try {
                if ( session ) {
                    const response=await axiosInstance.get( `${ baseurl }/friend/recievedReq`, {
                        withCredentials: true
                    } );
                    const requests=response.data;
                    console.log( 'Received Requests:', requests );

                    // Store received requests in localStorage
                    localStorage.setItem( 'receivedRequests', JSON.stringify( requests ) );

                    // Update received requests state
                    setReceivedRequests( requests );
                }
            } catch ( error ) {
                console.error( 'Error fetching received friend requests:', error );
            }
        };

        fetchReceivedRequests();
    }, [session] );

    const sendFriendRequest=async ( userId ) => {
        try {
            if ( session ) {
                const response=await axiosInstance.post( `${ baseurl }/friend/req/${ userId }`, {}, {
                    withCredentials: true // Include credentials in the request
                } );
                console.log( 'Friend request sent:', response.data );

                // Update sentRequests state immediately after sending request
                setSentRequests( prev => new Set( prev ).add( userId ) );

            } else {
                console.error( 'User session not found' );
            }
        } catch ( error ) {
            console.error( 'Error sending friend request:', error );
        }
    };

    const acceptFriendRequest=async ( requestId ) => {
        try {
            const response=await axiosInstance.post( `${ baseurl }/friend/pending/${ requestId }`, {}, {
                withCredentials: true
            } );
            console.log( 'Friend request accepted:', response.data );
            // Remove the accepted request from the receivedRequests state
            setReceivedRequests( prev => prev.filter( request => request._id!==requestId ) );
            window.location.reload()
        } catch ( error ) {
            console.error( 'Error accepting friend request:', error );
        }
    };

    useEffect( () => {
        // Load received requests from localStorage if available
        const storedRequests=localStorage.getItem( 'receivedRequests' );
        if ( storedRequests ) {
            setReceivedRequests( JSON.parse( storedRequests ) );
        }
    }, [] );

    if ( loading ) {
        return <p>Loading...</p>;
    }

    return (
        <div className='card-container'>
            <Navbar />
            <div className="friend-container">


                {session? (
                    <div className="welcome-message">
                        <Friend2 />
                    </div>
                ):(
                    <p>Loading session...</p>
                )}
                <div className="all-users">
                    <h2>All Users</h2>
                    <ul>
                        {allUsers.map( user => (
                            <li key={user._id}>
                                {user.name} ({user.email})
                                <button
                                    className="send-request-btn"
                                    onClick={() => sendFriendRequest( user._id )}
                                    disabled={sentRequests.has( user._id )}
                                >
                                    {sentRequests.has( user._id )? 'Req Sent':'Send Req'}
                                </button>
                            </li>
                        ) )}
                    </ul>
                </div>
                <div className="received-requests">
                    <h2>Received Friend Requests</h2>
                    <ul>
                        {receivedRequests.map( request => (
                            <li key={request._id}>
                                <span className="request-from">Request from: {request.senderName} ({request.senderEmail})</span>
                                <button
                                    className="accept-request-btn"
                                    onClick={() => acceptFriendRequest( request._id )}
                                >
                                    Accept Request
                                </button>
                            </li>
                        ) )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FriendComponent;
