import React, { useState } from 'react';
import "../styles/Home.css";
import Navbar from '../components/Navbar';
import ImageAnalyzer from '../components/ImageAnalyzer';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { loginUser, registerUser } from '../api';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user')); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('user') || ""); 
  const [error, setError] = useState("");

  const handleLogin = async (username, password) => {
    
      const data = await loginUser(username, password); 
      if (data == "None") {
        setError('Incorrect username or password');
        return;
      }
      setIsLoggedIn(true);
      console.log(data);
      setUsername(data); 
      localStorage.setItem('user', data); 
      setIsModalOpen(false);
      setError("");  
    } 
  

  const handleRegister = async (name, username, password) => {
    try {
      const data = await registerUser(name, username, password); 
      setIsLoggedIn(true);
      setUsername(data); 
      localStorage.setItem('user', data);
      setIsModalOpen(false);
      setError(""); 
    } catch (error) {
      setError('Registration failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById(isRegister ? "registerUsername" : "loginUsername").value;
    const password = document.getElementById(isRegister ? "registerPassword" : "loginPassword").value;

    if (!usernameInput || !password) {
      setError('Please input all fields');
      return;
    }

    if (isRegister) {
      const name = document.getElementById("registerName").value;
      handleRegister(name, usernameInput, password);
    } else {
      handleLogin(usernameInput, password);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError("");  // Clear error when modal is closed
  };

  const handleToggleForm = () => {
    setIsRegister(prev => !prev);
    setError("");  // Clear error when toggling between forms
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUsername("");
    setIsModalOpen(false); 
  };

  return (
    <div className="homepage">
      <div className={`main-content ${isModalOpen ? 'blurred' : ''}`}>
        <Navbar 
          setIsModalOpen={setIsModalOpen} 
          isLoggedIn={isLoggedIn} 
          username={username} 
          handleLogout={handleLogout} 
        />
        <div className="first-page">
          <div className="title">
            Hi there! Welcome to<div>&nbsp;</div><div className='shadow'>BiteWise</div>
          </div>
          <div className="subtitle">
            BiteWise is your ultimate kitchen companion, designed to simplify food management. Hold up your groceries or upload a photo, and let BiteWise automatically track expiry dates, helping you reduce food waste and plan smarter meals. Stay organized and make the most of your ingredients!
          </div>
          <div className="see-foods">
            <button onClick={() => {
              const anchor_home = document.querySelector('#second-page');
              anchor_home.scrollIntoView({ behavior: 'smooth' });
            }}>See expiring foods</button>
          </div>
          <KeyboardArrowDownIcon className="arrow-down" />
        </div>
        <div className="second-page" id="second-page">
          <div className="title2">Expiring soon</div>
          {isLoggedIn ? (
            <div className="food-list">
            </div>
          ) : (
            <div className="login-prompt">
              <button onClick={() => setIsModalOpen(true)}>
                Log in to see expiring foods
              </button>
            </div>
          )}
        </div>
        <div className='third-page'>
        </div>
        <div className='fourth-page'>
          <div className="title4">Add your groceries</div>
          <div className="webcam">
            <ImageAnalyzer />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{isRegister ? 'Register' : 'Login'}</h2>
            <form>
              {isRegister ? (
                <>
                  <input type="text" placeholder="Username" required id="registerName" />
                  <input type="text" placeholder="Username" required id="registerUsername" />
                  <input type="password" placeholder="Password" required id="registerPassword" />
                </>
              ) : (
                <>
                  <input type="text" placeholder="Username" required id="loginUsername" />
                  <input type="password" placeholder="Password" required id="loginPassword" />
                </>
              )}
              {error && <div className="error-message">{`* ${error}`}</div>}
              <button type="submit" onClick={handleSubmit}>
                Submit
              </button>
            </form>
            <p>
              {isRegister ? (
                <>
                  Already have an account?{' '}
                  <button
                    className="toggle-link"
                    onClick={handleToggleForm}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  New here?{' '}
                  <button
                    className="toggle-link"
                    onClick={handleToggleForm}
                  >
                    Register now
                  </button>
                </>
              )}
            </p>
            <button className="close-button" onClick={handleCloseModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
