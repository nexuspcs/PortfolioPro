import React from 'react';
import './Navbar.css'; // Import the CSS file for styling
import logo from './logo.png'; // Import the logo image

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <span className="navbar-title">Portfolio Pro</span>
      </div>
      <div className="navbar-right">
        {/* <a href="/" className="navbar-link">dashboard</a>
        <span className="navbar-link navbar-link-inactive">predictions</span> */}
      </div>
    </nav>
  );
};

export default Navbar;
