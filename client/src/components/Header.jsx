// Header.js
// import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Logo from '/WebLogo.png';
import home from '/home.png';
import './Header.css';

import {
  FaSearch
} from 'react-icons/fa';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

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
          <form   onSubmit={handleSubmit}>
          <input type="search"    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

          <button className="search-button">
  <FaSearch className="search-icon" />
</button>

            
          </form>
        </li>
  
        <li>
          <Link  id='home' to='/'>
            <img src={home} alt="" />
          </Link>
        </li>
  
        <li>
          <Link to='/about' className="no-underline">
            About
          </Link>
        </li>
  
       <Link to='/profile'  className='no-underline'>
  {currentUser ? (
    <img
      className='headerprofileimg'
      src={currentUser.avatar}
      alt='profile'
    />
  ) : (
    <li  >Sign in</li>
  )}
</Link>

      </ul>
    </div>
  </>
  
  );
}

export default Header;
