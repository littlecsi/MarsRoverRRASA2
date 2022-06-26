import React from 'react';
import Navbar from './components/Navbar.js';
import './App.css';
import Home from './components/pages/Home.js';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Battery from './components/pages/Battery.js';
import Command from './components/pages/Command.js';
import About from './components/pages/About.js';


function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Routes>
        <Route path ='/' exact component={Home} />
        <Route path ='/Battery.js' exact component={Battery} />
        <Route path ='/Command.js' exact component={Command} />
        <Route path ='/About.js' exact component={About} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
