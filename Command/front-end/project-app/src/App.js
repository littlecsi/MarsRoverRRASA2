import React, { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Star} from 'react-konva';
import io from 'socket.io-client';

import Home from './components/pages/Home';
import Command from './components/pages/Command';
import Battery from './components/pages/Battery';
import View from './components/pages/View';

const Socket = io.connect('http://localhost:3000', {});
var arenaX = 0;
var arenaY = 0;
var arenaWidth = window.innerWidth;
var arenaHeight = window.innerHeight*3/4;
const roverWidth = 21;
var global_angle = 0;
var currPos = [window.innerWidth/2 - roverWidth/2, window.innerHeight/2];
var currPos_backend = [0,0];
var roverPath = [];
var detectionSet = [];

function displayDetection(detection, pos, angle) {
  var color = "#97df62";
  var numPoints = 5
  var innerRadius = 8
  var outerRadius = 16
  switch(detection[0]) {
    case "red":
      color = "#eb7bdd";
      break
    case "yellow":
      color = "#FFFF00";
      break
    case "fuchsia":
      color = "#eb7bdd";
      break
    case "green":
      color = "#97df62";
      break
    case "teal":
      color = "#008080";
      break
    case "blue ":
      color = "#8bcbd4";
      break
    case "bnw":
      color= "#1c1e1b"
      numPoints= 10
      innerRadius= 18
      outerRadius= 22
    default:
      //
  };
  //NO CLUE?
  var xpos = 12*Math.cos(angle*Math.PI/180) 
  var ypos = 12*Math.sin(angle*Math.PI/180) 
  detectionSet.push(
    <Star x={pos[0]+xpos} y={pos[1]+ypos} fill={color} numPoints={numPoints} innerRadius={innerRadius} outerRadius={outerRadius}/>
    );
}

function App() {

  const [batteryData, setBatteryData] = useState("unavailable");
  useEffect(() => {
    Socket.on('batteryData', data => {
      setBatteryData(data);
    });
  }, []);
  

  //const [angleDistanceSet, setAngleDistance] = useState([0,0]);
  useEffect(() => {
    Socket.on('AngleDistance', data => {
      console.log("AngleDistance from server: %s", data);
      //setAngleDistance(data);
      paths(data, "grey");
      if(currPos[0] < -arenaX) {
        arenaX = arenaX - currPos[0] + 100;
        arenaWidth = arenaWidth - currPos[0] + 100;
      } else if(currPos[0] > arenaWidth + arenaX) {
        arenaWidth = currPos[0] + 100;
      }
      if(currPos[1] < -arenaY) {
        arenaY = arenaY - currPos[1] + 100;
        arenaHeight = arenaHeight - currPos[1] + 100;
      } else if(currPos[1] > arenaHeight + arenaY) {
        arenaHeight = currPos[1] + 100;
      }
      //this.setState({});
    })
  }, []);

  const [detection, setDetection] = useState(["unknown",0]);
  useEffect(() => {
    Socket.on("Detection", data => {
      console.log("something detected: %s", data);
      setDetection(data);
      displayDetection(data, currPos, global_angle);
    });
  });
  useEffect(() => {
    Socket.on("RoverPosition", data => {
      Socket.emit("RoverPosition", currPos_backend);
    });
  }, []);
  useEffect(() => {
    Socket.on("GlobalAngle", data => {
      Socket.emit("GlobalAngle", global_angle);
    });
  }, []);


  return (
    <>
      <Router>
        <Navbar />
        <Routes>
        <Route path='/' exact render={(props) => (
          <Home/>
        )} />
        <Route path='/command' render={(props) => (
          <Command/>
        )} />
        <Route path='/battery' render={(props) => (
          <Battery {...props} currentCapacity={batteryData} />
        )} />
         <Route path='/view' render={(props) => (
          <View {...props} pos={currPos} detection={detectionSet} arena={[arenaX,arenaY,arenaWidth,arenaHeight]}/>
        )} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
