import React from 'react'
import "../styles/Home.css"
import Navbar from '../components/Navbar'
import ImageAnalyzer from '../components/ImageAnalyzer'

function Home() {
  return (
    <div className='homepage'>
      <Navbar />
      <div className="first-page">
        <div className="title">
        <ImageAnalyzer />

          </div>
      </div>
      <div className="second-page">

      </div>
      <div className='third-page'>
      </div>
      <div className='fourth-page'>
      </div>
    </div>
  )
}

export default Home
