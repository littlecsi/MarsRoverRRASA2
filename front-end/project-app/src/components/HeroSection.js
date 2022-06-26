import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';
import {Link} from 'react-router-dom';

function HeroSection() {
  return (
    <div className='hero-container'>
      <img src="img-home.jpeg" alt="test logo"></img>
      <h1>MARS ROVER</h1>
      <div className='hero-btns'>
        <Link to='/command'>
          <Button
            className='btns'
            buttonStyle='btn--outline'
            buttonSize='btn--large'
          >
            MANAUL CONTROL
          </Button>
        </Link>

        <Link to='/view'>
          <Button
            className='btns'
            buttonStyle='btn--primary'
            buttonSize='btn--large'
            onClick={console.log('hey')}
          >
            VIEW MAP <i className='far fa-play-circle' />
          </Button>
        </Link>

      </div>
    </div>
  );
}

export default HeroSection;
