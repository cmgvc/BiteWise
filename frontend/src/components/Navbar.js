import React, { useState } from 'react';
import "../styles/Navbar.css";

export default function Navbar({ setIsModalOpen, isLoggedIn, username, handleLogout }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleConfirmLogout = () => {
    handleLogout();
    setIsLogoutModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <div className="Nav">
      <div className="nav-logo">
        <a href="/">BiteWise</a>
      </div>
      <div className="nav-links">
        <a href="/">Home</a>
        <a href="/fridge">Fridge</a>
      </div>
      <div className="login">
        {isLoggedIn ? (
          <div className="username">
            <button onClick={handleLogoutClick}>{username}</button>
          </div>
        ) : (
          <button onClick={() => setIsModalOpen(true)}>Login</button>
        )}
      </div>

      {isLogoutModalOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Logout?</h2>
            <div className="modal-buttons">
              <button onClick={handleConfirmLogout}>Yes</button>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
