import React from 'react';
import './Cards.css';
import CardItem from './CardItem';

function Cards() {
  return (
    <div className='cards'>
      <h1>Check out this rover</h1>
      <div className='cards__container'>
          <ul className='cards__items'>
            <CardItem
              src='img-home.jpeg'
              text='Current battery status of the rover'
              label='Battery'
              path='/battery'
            />
            <CardItem
              src='noImage'
              text='Map View'
              label='View'
              path='/view'
            />
          </ul>
        </div>
    </div>
  );
}

export default Cards;
