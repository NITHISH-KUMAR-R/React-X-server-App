import React from 'react';
import './FriendsNavbar.css'; // Import custom CSS for styling
import { Link } from 'react-router-dom';

const FriendsNavbar=() => {

    return (
        <div className='top-container'>
            <nav className="friendNavbar">
                <ul className="nav-list">

                    <ul className="list">
                        <li className="userFriends">
                            <Link to="/friends/myfriends">My Friends</Link>
                        </li>
                        <li className="userFriends">
                            <Link to="/friends/allusers">All Users</Link>
                        </li>
                        <li className="userFriends">
                            <Link to="/friends/receivedrequests">Received Requests</Link>
                        </li>
                    </ul>



                </ul>
            </nav>
        </div>

    );

}
export default FriendsNavbar;
