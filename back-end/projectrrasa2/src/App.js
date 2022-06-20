import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/pages/home';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path ='/' exact component={Home} />
      </Routes>
    </Router>
    <div className="App">
    </div>
    </>
  );
}

export default App;
