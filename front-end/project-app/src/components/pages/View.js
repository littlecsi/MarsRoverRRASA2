import React from 'react';
import '../../App.css';
import Map from '../drawMap';

function View({pos, detection, arena}) {
  return (
    <div className='view-container'>
        <h1>Welcome to the View page</h1>
        <div className='mapping'>
            <Map pos={pos} detection={detection} arena={arena}/>
        </div>
    </div>
);
}
export default View;
