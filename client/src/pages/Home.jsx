import React from 'react'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Notification from '../components/Notification'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import Features from '../components/Features'
import Layout from '../components/Layout'

const Home = ()=>{
  return(
    <div>
      <Hero />
      <HowItWorks />
      <Features/>
      <FAQ />
      <Footer/>
      <Notification/>
    </div>
  )
}

export default Home