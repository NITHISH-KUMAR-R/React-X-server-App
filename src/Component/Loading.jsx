// src/components/Loading.js
import React from 'react';
import './Loading.css'; // Import custom CSS for styling the loading indicator

const Loading=() => {
    return (
        <div className="loading-container">
            <div className="spinner"></div>
        </div>
    );
};

export default Loading;
