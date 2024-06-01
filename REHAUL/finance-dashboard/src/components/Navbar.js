import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS file for styling
import logo from './resources/images/logo.png'; // Import the logo image

const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo" />
          <span className="navbar-title">Portfolio Pro</span>
        </div>
        <div className="navbar-right">
          <button className="help-button" onClick={openModal}>
            <span className="help-icon">?</span> Help
          </button>
        </div>
      </nav>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={closeModal}>&times;</span>
            <h2>Help</h2>
            <p class="helpSectionTXTblock">This is the help section. Here you can find information and links to help you navigate the site.</p>
            <ul>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Contact Support</a></li>
              <li><a href="https://docs.google.com/document/d/1NURz-jVA2e_gDFBphvJ5XpDmnIhUVbX_Hjks45zJurk/edit?usp=sharing">User Manual</a></li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;