import React, { useEffect, useState } from 'react';
import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';
import './Friend3.css';

import Navbar from './Navbar'; // Import Navbar component
import FriendsNavbar from './FriendsNavbar';
import Loading from './Loading'; // Import the Loading component

const Friend3=() => {
    const [allUsers, setAllUsers]=useState( [] );
    const [sentRequests, setSentRequests]=useState( new Set() );
    const [receivedRequests, setReceivedRequests]=useState( [] );
    const [loading, setLoading]=useState( true ); // Loading state

    useEffect( () => {
        const fetchAllUsers=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/friend/unkownuser`, {
                    withCredentials: true,
                } );
                const allUserData=response.data;
                setAllUsers( allUserData );
                setLoading( false ); // Data fetched successfully, stop loading
            } catch ( error ) {
                console.error( 'Error fetching all users:', error );
                setLoading( false ); // Stop loading on error
            }
        };

        const fetchPendingRequests=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/friend/pendingReq`, {
                    withCredentials: true,
                } );
                const { sentRequests, receivedRequests }=response.data;

                setSentRequests( new Set( sentRequests.map( request => request.receiver._id ) ) );
                setReceivedRequests( receivedRequests );
            } catch ( error ) {
                console.error( 'Error fetching pending requests:', error );
            }
        };

        fetchAllUsers();
        fetchPendingRequests();
    }, [] );

    const sendFriendRequest=async ( userId ) => {
        try {
            await axiosInstance.post(
                `${ baseurl }/friend/req/${ userId }`,
                {},
                { withCredentials: true }
            );

            setSentRequests( prevSentRequests => new Set( [...prevSentRequests, userId] ) );
        } catch ( error ) {
            console.error( 'Error sending friend request:', error );
        }
    };

    const capitalizeFirstLetter=( string ) => {
        return string.charAt( 0 ).toUpperCase()+string.slice( 1 );
    };

    return (
        <div>
            <Navbar />
            <FriendsNavbar />

            <div className='container-friend3'>
                {loading? <Loading />:
                    allUsers.length>0? (
                        allUsers.map( user => (
                            <li key={user._id}>
                                {capitalizeFirstLetter( user.username )}
                                <button
                                    onClick={() => sendFriendRequest( user._id )}
                                    className='button'
                                    disabled={sentRequests.has( user._id )||receivedRequests.some( request => request.sender._id===user._id )}
                                >
                                    {sentRequests.has( user._id )? 'Request Sent':
                                        ( receivedRequests.some( request => request.sender._id===user._id )? 'Request Received':'Send Request' )}
                                </button>
                            </li>
                        ) )
                    ):(
                        <div>No users found</div>
                    )
                }
            </div>
        </div>
    );
};

export default Friend3;
