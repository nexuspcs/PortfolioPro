/**
 * Navbar component for the PortfolioPro application.
 * Renders a navigation bar with a logo, title, and a help button.
 * Displays a modal with helpful links when the help button is clicked.
 */
import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS file for styling
import logo from './resources/images/logo.png'; // Import the logo image
import banner from './resources/images/banner-highestres.svg'; // Import the banner image

/**
 * Navbar functional component.
 * @returns {JSX.Element} The JSX element representing the Navbar component.
 */
const Navbar = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  /**
   * Opens the modal.
   */
  const openModal = () => {
    setModalOpen(true);
  };

  /**
   * Closes the modal.
   */
  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <a href="https://portfoliopro.au">
            <img src={logo} alt="Logo" className="navbar-logo" />
          </a>
          <a href="https://portfoliopro.au" className="navbar-title">
            PortfolioPro
          </a>
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
            <p className="helpSectionTXTblock">Welcome to PortfolioPro, and thanks for stopping by. Below, you can find useful links to help you use our site.</p>
            <ul className='helpLinks'>
              <li><a href="mailto:james@portfoliopro.au?subject=Query%20regarding%20PortfolioPro">Contact Support</a></li>
              <li><a href="https://docs.google.com/document/d/1NURz-jVA2e_gDFBphvJ5XpDmnIhUVbX_Hjks45zJurk/edit?usp=sharing">User Manual</a></li>
            </ul>
            <br></br>
            <a href="https://portfoliopro.au"><img src={banner} alt="Banner" className="helpModalBanner" /></a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;