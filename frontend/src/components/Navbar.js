import React from 'react'
import "../styles/Navbar.css"

export default function Navbar() {
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
        <a href=""><button>Login</button></a>
      </div>
    </div>
  )
}
