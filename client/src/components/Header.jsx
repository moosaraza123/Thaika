// Header.js
// import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import React from 'react';

import Logo from '/WebLogo.png';
import home from '/home.png';
import './Header.css';
// import {useSelector} from 'react-redux'

function Header() {
  
  return (
    <>
      <div className="mainHeadDiv">
        <ul>
          <li>
            <Link to='/'>
              <img src={Logo} alt="" />
            </Link>
          </li>

          <li>
            <form>
              <input type="search" />
            </form>
          </li>

          <li>
            <Link to='/'>
              <img src={home} alt="" />
            </Link>
          </li>

          <li>
            <Link to='/about' className="no-underline">
              About
            </Link>
          </li>

          <li>
            <Link to='/sign-in' className="no-underline">
              Sign In
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Header;
