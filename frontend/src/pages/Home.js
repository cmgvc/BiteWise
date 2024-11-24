import React from 'react'
import "../styles/Home.css"
import Navbar from '../components/Navbar'
import ImageAnalyzer from '../components/ImageAnalyzer'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

function Home() {
  return (
    <div className='homepage'>
      <Navbar />
      <div className="first-page">
        <div className="title">
            Hi there! Welcome to<div>&nbsp;</div><div className='shadow'>BiteWise</div>
        </div>
        <div className="subtitle">
            BiteWise is your ultimate kitchen companion, designed to simplify food management. Hold up your groceries or upload a photo, and let BiteWise automatically track expiry dates, helping you reduce food waste and plan smarter meals. Stay organized and make the most of your ingredients!
        </div>
        <div className="see-foods">
            <button>See expiring foods</button>
          </div>
          <KeyboardArrowDownIcon className="arrow-down"/>
      </div>
      <div className="second-page">

      </div>
      <div className='third-page'>
      </div>
      <div className='fourth-page'>
      <div className="webcam">
          <ImageAnalyzer />

            </div>
      </div>
    </div>
  )
}

export default Home
