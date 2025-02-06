import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import './App.css'




const App =()=>{
  return ( 

    <div className="" >
      <ToastContainer/>
      <Navbar/>
    
      
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Home/>} />

        {/* Other Routes */}
        
       

        

      
      </Routes>
      <Footer/>
    </div>
  );
}



export default App