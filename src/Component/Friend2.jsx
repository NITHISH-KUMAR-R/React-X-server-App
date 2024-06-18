import React, { useEffect, useState } from 'react';

import './Friend2.css';
import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';



//import './FriendList.css'; // Assuming you have a CSS file for styling

const Friend2=() => {
    const [friendList, setFriendList]=useState( [] );
    const [error, setError]=useState( '' );

    useEffect( () => {
        const fetchFriends=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/friend/all` ); // Adjust the URL as per your backend setup
                setFriendList( response.data ); // Assuming response.data is an array of friends
            } catch ( error ) {
                console.error( 'Error fetching friends:', error );
                setError( 'Error fetching friends. Please try again.' ); // Update error state
            }
        };

        fetchFriends();
    }, [] );

    if ( error ) {
        return <div className="friend-list"><p>{error}</p></div>;
    }

    return (
        <div className="friend-list">
            <h2>My Friends</h2>
            <ul>
                {friendList.map( friend => (
                    <li key={friend._id}>
                        <div>
                            <strong>Name:</strong> {friend.fName}
                        </div>
                        <div>
                            <strong>Email:</strong> {friend.fEmail}
                        </div>
                    </li>
                ) )}
            </ul>
        </div>
    );
};



export default Friend2;
