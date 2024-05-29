import React from 'react';
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="path/to/logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">Portfolio Pro</span>
      </div>
      <div className="navbar-right">
        <span className="navbar-link">dashboard</span>
        <span className="navbar-link navbar-link-inactive">predictions</span>
      </div>
    </nav>
  );
};

export default Navbar;
