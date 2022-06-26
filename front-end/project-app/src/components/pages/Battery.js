import React from 'react';
import '../../App.css';
import {Stage, Layer, Text} from 'react-konva';
import {displayCells} from '../batterycells.js';


export default function Battery(currentCapacity) {
  var currentCapacityText = typeof(currentCapacity) === 'undefined' ? "Battery capacity: unavailable" : "Battery capacity: " + Number(currentCapacity)+ " %";
  var batteryHealthText = typeof(currentCapacity) === 'undefined' ? "Maximum capacity: unavailable" : "Maximum capacity: " + 100 + " %";
  return (
    <>
      <h1>MARS ROVER</h1>
      <h1 className='Battery'>Welcome to the Battery page</h1>
      <Stage width={window.innerWidth} height={window.innerHeight*3/4}>
            <Layer>
                <displayCells {...props} currentCapacity={currentCapacity} />
                <Text x={550} y={70} text={currentCapacityText} fontSize={30} fill="black" />
                <Text x={550} y={170} text="Battery Health" fontSize={30} textDecoration="bold" fill="black" />
                <Text x={550} y={220} text={batteryHealthText} fontSize={20} fill="black" />
            </Layer>
        </Stage>
    </>
  );
}
