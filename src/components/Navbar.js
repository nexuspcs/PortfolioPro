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
            <p className="helpSectionTXTblock">PortfolioPro has been developed solely by James Coates, and is currently actively maintained by James. He has been developing web apps for some time now, and recently, began to learn React. PortfolioPro is built on React, and hence, this application made good use of James' elementary React skills, with many challenges and surprises along the way. Ultimately, PortfolioPro yields a success, when measured against its design brief.</p>
            <br></br>
            <hr></hr>
            <br></br>
            <p className="helpSectionTXTblockCC">The application is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License You can find more information about the license by clicking on the link below.</p>
            <br></br>
            <p className="helpSectionTXTblockCC2">
              <a href="https://portfoliopro.au" title="PortfolioPro">
                PortfolioPro&nbsp;
              </a>
              by&nbsp;
              <a href="https://www.linkedin.com/in/jamescoatesaus/" title="James Coates">
                James Coates&nbsp;
              </a>
              is licensed under
              <br></br>
              <a
                href="https://creativecommons.org/licenses/by-nc-nd/4.0/?ref=chooser-v1"
                target="_blank"
                rel="license noopener noreferrer"
                style={{ display: 'inline-block' }}
              >

                <div>CC BY-NC-ND 4.0&nbsp;
                  <hr></hr>
                  <img
                    style={{ height: '22px', marginLeft: '0px', verticalAlign: 'text-bottom' }}
                    src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"
                    alt="Creative Commons"
                  />
                  <img
                    style={{ height: '22px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
                    src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"
                    alt="Attribution"
                  />
                  <img
                    style={{ height: '22px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
                    src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"
                    alt="NonCommercial"
                  />
                  <img
                    style={{ height: '22px', marginLeft: '3px', verticalAlign: 'text-bottom' }}
                    src="https://mirrors.creativecommons.org/presskit/icons/nd.svg?ref=chooser-v1"
                    alt="NoDerivatives"
                  /></div>
              </a>
            </p>
            <br></br>
            <hr></hr>
            <a href="https://portfoliopro.au"><img src={banner} alt="Banner" className="helpModalBanner" /></a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;