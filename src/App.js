import logo from './logo.svg';
import './App.css';
import React from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Signin from './components/Signin';
import NewPost from './Pages/NewPost';
import Posts from './Pages/Posts';
import Post from './Pages/Post';
import PostNavigate from './Pages/PostNavigate';
import Profile from './Pages/Profile';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import firebase from './utils/firebase';

function App() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
      <BrowserRouter>
      <Header user={user}/>
        <Routes>
          <Route path="/posts/*" element={<PostNavigate user={user}/>} exact/>
          <Route path="/Signin" element={user? <Navigate to={"/posts"}/> :<Signin />} exact/>
          <Route path="/new-post" element={user? <NewPost /> :<Navigate to={"/posts"}/>} exact/>
          <Route path="/my/*" element={user? <Profile user={user}/> : <Navigate to={"/posts"}/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
