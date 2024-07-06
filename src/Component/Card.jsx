// src/Component/Card.js
import React from 'react';
import './Card.css'; // Ensure to create this CSS file for styling

const Card=( { username, userPost, likes, disLikes, date, onLike, onDislike } ) => {

    return (
        <div className="card">
            <div className="card-header">
                <h4>{username}</h4>
                <span className="post-date">{date}</span>
            </div>
            <div className="card-content">
                <p>{userPost}</p>
            </div>
            <div className="card-actions">
                <button className="like-button" onClick={onLike}>Like {likes}</button>
                <button className="dislike-button" onClick={onDislike}>Dislike {disLikes}</button>
            </div>
        </div>
    );
};

export default Card;
