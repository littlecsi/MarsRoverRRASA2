import React from 'react';
import '../../App.css';
import {Rect} from 'react-konva';


export default function displayCells(currentCapacity) {
    var displayCapactity = currentCapacity;
    var ypos = 200
    while (displayCapactity >= 10){
        ypos = ypos + 30;
        displayCapactity= displayCapactity - 10;
        return (
            <>
            <Rect x={200} y={ypos} width={40} height={20} fill="green"/>
            </>
        );
    }
    return (
        <>
        <Rect x={194} y={190} width={51} height={310} fill="transparent" strokeWidth={2} stroke="black"/>
        </>
    );


}
