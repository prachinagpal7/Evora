import React from 'react'
import Navbar from '../components/Navbar' //importing navbar component 
import Hero from '../components/Hero' //importing hero component
import AiTools from '../components/AiTools'
import Plan from '../components/Plan'
import Footer from '../components/Footer'
import Community from '../components/Community'

const Home = () => {
  return ( 
    <>   {/* React Fragment (empty wrapper), Same as div but doesn't add extra DOM element */}
      <Navbar /> 
      <Hero />
      <AiTools />
      <Community />
      <Plan />
      <Footer />
    </>
  )
} 

export default Home
