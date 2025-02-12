import './App.css';
import React from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Fridge from './pages/Fridge';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fridge" element={<Fridge />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
