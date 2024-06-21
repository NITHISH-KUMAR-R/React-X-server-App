import React, { useEffect, useState } from 'react';
import './Friend2.css';
import './Friend.css'
import { baseurl } from '../url';
import axiosInstance from '../axiosConfig';
import Navbar from './Navbar';
import FriendsNavbar from './FriendsNavbar';
import Loading from './Loading';

const Friend2=() => {
    const [friendList, setFriendList]=useState( [] );
    const [error, setError]=useState( '' );
    const [loading, setLoading]=useState( true )

    useEffect( () => {
        const fetchFriends=async () => {
            try {
                const response=await axiosInstance.get( `${ baseurl }/friend/all` );
                setFriendList( response.data );
                setLoading( false )
            } catch ( error ) {
                console.error( 'Error fetching friends:', error );
                setError( 'Error fetching friends. Please try again.' );
            }
        };

        fetchFriends();
    }, [] );

    const capitalizeFirstLetter=( string ) => {
        return string.charAt( 0 ).toUpperCase()+string.slice( 1 );
    };

    if ( error ) {
        return <div className="friend-list"><p>{error}</p></div>;
    }

    return (
        <div>
            <Navbar />
            <FriendsNavbar />
            <div className="friend-list">

                <h2>My Friends</h2>
                {loading? <Loading />:

                    <ul>
                        {friendList.map( ( friend ) => (
                            <li key={friend._id} className="friend-item">
                                {capitalizeFirstLetter( friend.fName )}
                                <span role="img" aria-label="Love">💌</span>
                            </li>
                        ) )}
                    </ul>
                }
            </div>
        </div>

    );
};

export default Friend2;
