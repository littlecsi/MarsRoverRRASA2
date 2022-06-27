import React, {useState} from 'react';
import './pages.css';
import '../../App.css';
import Socket from '../../App.js';
import {Button} from '../Button';

export default function Command() {
  var drivingMethod = "manual";

  function sendControlData() {
    if(drivingMethod === "auto") {
        alert("The rover is in automated driving mode. Press 'Stop!' before trying again.");
    } 
    else {
        if((document.getElementById('angle').value === '') && (document.getElementById('distance').value === '')){
          alert('Error: Missing Angle or Distance');
        } 
        else {
          var enteredAngle = document.getElementById('angle').value;
          var enteredDistance = document.getElementById('distance').value;
          if (document.getElementById('speed').value === ''){
            var enteredSpeed = 50;
          }
          else{
            var enteredSpeed = document.getElementById('speed').value;
          }
          Socket.emit("Angle", enteredAngle);
          Socket.emit("Distance", enteredDistance);
          Socket.emit("Speed", enteredSpeed);
          alert("Sent");
        }
    }
  }
  function autodrive() {
    drivingMethod = "auto";
    Socket.emit("Command", "start");
    alert("Automated driving activated");
  }
  function stop() {
      Socket.emit("Command", "stop");
      drivingMethod = "manual";
      alert("Automated driving de-activated");
  }

  return (
    <div className='command-container'>
        <h1>Welcome to the Command page</h1>
        <h4 className="automated header">Automated Driving</h4>
        <h4 className="manual header">Manual Driving</h4>
        <div className='command-btns'>
            <div className='start'>
                <Button name="button" className='btns' buttonStyle='btn-outline' buttonSize='btn--medium' onClick={autodrive}>
                    Start
                </Button>
            </div>
            <div className='stop'>
                <Button name="button" className='btns' buttonStyle='btn-outline' buttonSize='btn--medium' onClick={stop}>
                    Stop!
                </Button>
            </div>
            <label for='angle' name='angle' className='angleLabel'>Angle (in degrees) : </label>
            <input type='number' id='angle' name='angle' className='angleBox'/>
            <label for='distance' name='distance' className='distanceLabel'>Distance (in mm) : </label>
            <input type='number' id='distance' name='distance' className='distanceBox'/>
            <label for='speed' name='speed' className='speedLabel'>(Optional) Speed (Integers in range 10 - 70) : </label>
            <input type='number' id='speed' name='speed' className='speedBox'/>
            <h4>*Speed set to 50 when left empty</h4>
            <div className='sendcontroldata'>
                <Button name="button" className='btns' buttonStyle='btn-outline' buttonSize='btn--medium' onClick={sendControlData}>
                    Send
                </Button>
            </div>
        </div>
    </div>
  );  
}
