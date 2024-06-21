import React, { useEffect, useState } from 'react';
import './Friend.css';
import Navbar from './Navbar';
import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';
import FriendsNavbar from './FriendsNavbar';
import Loading from './Loading'; // Assuming you have a Loading component

const FriendComponent=() => {
    const [receivedRequests, setReceivedRequests]=useState( [] ); // To store received friend requests
    const [loading, setLoading]=useState( true ); // To manage loading state

    useEffect( () => {
        const fetchAllUsers=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/friend/unkownuser`, {
                    withCredentials: true, // Include credentials in the request
                } );
                console.log( response.data );
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
                const response=await axiosInstance.get( `${ baseurl }/friend/recievedReq`, {
                    withCredentials: true,
                } );
                const requests=response.data;
                console.log( 'Received Requests:', requests );

                // Update received requests state
                setReceivedRequests( requests );
            } catch ( error ) {
                console.error( 'Error fetching received friend requests:', error );
            }
        };

        fetchReceivedRequests();
    }, [] );

    const acceptFriendRequest=async ( requestId ) => {
        try {
            const response=await axiosInstance.post(
                `${ baseurl }/friend/pending/${ requestId }`,
                {},
                {
                    withCredentials: true,
                }
            );
            console.log( 'Friend request accepted:', response.data );

            // Remove the accepted request from the receivedRequests state
            setReceivedRequests( ( prev ) =>
                prev.filter( ( request ) => request._id!==requestId )
            );
        } catch ( error ) {
            console.error( 'Error accepting friend request:', error );
        }
    };

    const capitalizeFirstLetter=( string ) => {
        return string.charAt( 0 ).toUpperCase()+string.slice( 1 );
    };

    return (
        <div>
            <Navbar />
            <div className="friend-container">
                {/* {loading? (
                    <Loading />
                ):( */}
                <FriendsNavbar />
                <div className="content">

                    <div className="received-requests">
                        <h2>Received Friend Requests</h2>
                        <ul>
                            {receivedRequests.map( ( request ) => (
                                <li key={request._id}>
                                    <span className="request-from">
                                        {capitalizeFirstLetter( request.senderName )}
                                    </span>
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
                {/* )}  used for loading*/}
            </div>
        </div>
    );
};

export default FriendComponent;
