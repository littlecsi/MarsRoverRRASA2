import React from 'react';
import {Stage, Layer, Text, Circle, Rect} from 'react-konva';

var arenaX = 0;
var arenaY = 0;
var arenaWidth = window.innerWidth;
var arenaHeight = window.innerHeight*3/4;

//NO CLUE ABOUT SLEECTION STATEMENTS BELOW
function Map({pos, detection, arena}) {
    var roverWidth = 21;
    var basePos = [window.innerWidth/2 - roverWidth/2, window.innerHeight/2];
    if(pos[0] < -arenaX) {
        arenaX = arenaX - pos[0] + 100;
        arenaWidth = arenaWidth - pos[0] + 100;
    }
    else if(pos[0] > arenaWidth + arenaX) {
        arenaWidth = pos[0] + 100;
    }
    else if(pos[1] < -arenaY) {
        arenaY = arenaY - pos[1] + 100;
        arenaHeight = arenaHeight - pos[1] + 100;
    }
    else if(pos[1] > arenaHeight + arenaY) {
        arenaHeight = pos[1] + 100;
    }
    return (
        <Stage x={arena[0]} y={arena[1]} width={arena[2]} height={arena[3]}>
            <Layer>
                <Text x={30} y={20} text="Key:" fontSize={20} />
                <Text x={40} y={44} text="Black circle: rover's current position" fontSize={16} />
                <Text x={40} y={62} text="Red rectangle: base" fontSize={16} />
                <Rect x={basePos[0]} y={basePos[1]} width={40} height={40} fill="red"/>
                <Circle x={pos[0]} y={pos[1]} radius={20} fill="black" />
                {detection}
            </Layer>
        </Stage>
    )
}
export default Map;
