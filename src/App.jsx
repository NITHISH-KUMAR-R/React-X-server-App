// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login/login';
import Homepage from './Home/homepage';
import Timeline from './Component/Timeline';
import PrivateRoute from './Component/PrivateRoute';
// Assuming you have a Navbar component

import './App.css';

import About from './Component/About';
import FriendComponent from './Component/Friend';
import FriendPosts from './Component/FriendsPostonly';
import Friend2 from './Component/Friend2';
import Friend3 from './Component/Friend3';

function App() {
  return (
    <div className="App">

      <Router>

        <Routes>
          <Route path="*" element={<Login />} />

          <Route path="/login" element={<Login />} />
          <Route path="/homepage" element={<PrivateRoute element={Homepage} />} />
          <Route path="/timeline" element={<PrivateRoute element={Timeline} />} />
          <Route path="/friendspost" element={<PrivateRoute element={FriendPosts} />} />
          <Route path="/about" element={<PrivateRoute element={About} />} />
          <Route path="/friend" element={<PrivateRoute element={FriendComponent} />} />

          <Route path="/friends/myfriends" element={<PrivateRoute element={Friend2} />} />
          <Route path="/friends/allusers" element={<PrivateRoute element={Friend3} />} />
          <Route path="/friends/receivedrequests" element={<PrivateRoute element={FriendComponent} />} />


        </Routes>
      </Router>
    </div>
  );
}

export default App;
