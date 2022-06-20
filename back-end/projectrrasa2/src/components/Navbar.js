import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css';



function Navbar() {
    const[click,setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(!click);

    const showButton = () =>{
        if(window.innerWidth <= 960) {
            setButton(false);
        }
        else{
            setButton(true);
        }
    };
    useEffect(() => {
        showButton();
    }, []);

window.addEventListener('resize',showButton);

    return (
    <>  
        <nav className="navbar">
            <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
                RRASA2
                <i class="fa-solid fa-satellite"></i>            
            </Link>
            <div className ="navbar-conntainer"> 
                <div className='menu-icon' onClick = {handleClick}>
                    <i className={click ? 'fas fa-times': 'fas fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to ='/' className='nav-links' onClick={closeMobileMenu}>
                            Home
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to ='/command' className='nav-links' onClick={closeMobileMenu}>
                            Command
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to ='/battery' className='nav-links' onClick={closeMobileMenu}>
                            Battery
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to ='/about' className='nav-links' onClick={closeMobileMenu}>
                            About
                        </Link>
                    </li>
                </ul>
                {button && <Button buttonStyle='btn--outline'>GET STARTED</Button>}
            </div>
        </nav>
    </>

  )
}

export default Navbar;