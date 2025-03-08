import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import './App.css'
import UserDashboard from './pages/UserDashboard';
import Heatmap from './pages/Heatmap';
import AboutUs from './pages/AboutUs';




const App =()=>{
  return ( 

    <div className="" >
      <ToastContainer/>
      <Navbar/>
    
      
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Home/>} />

        {/* Other Routes */}
        <Route path="/user-dashboard" element={<UserDashboard/>} />
        <Route path="/heat-map" element={<Heatmap/>} />
        <Route path="/about" element={<AboutUs/>} />
        
       

        

      
      </Routes>
     
    </div>
  );
}



export default App