import React from 'react'
import {Routes, Route} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './context/SocketContext'; // ✅ Add this import
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AddProposal from './components/AddProposals';
import AllProposals from './pages/AllProposals';
import Home from './pages/Home';
import './App.css'
import UserDashboard from './pages/UserDashboard';
import Heatmap from './pages/Heatmap';
import AboutUs from './pages/AboutUs';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProfile } from '@clerk/clerk-react';
import Profile from './pages/Profile';
import YourProposals from './pages/YourProposals';
import ProjectTrackingPage from './pages/ProjectTrackingPage';
import ContactPage from './pages/ContactPage';

const App = () => {
  return ( 
    <SocketProvider> {/* ✅ Wrap everything with SocketProvider */}
      <div className="">
        <ToastContainer/>
        <Navbar/>
        
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<AboutUs/>} />
          <Route path="/contact" element={<ContactPage/>} />

          {/* Clerk User Profile Route */}
          <Route path="/user-dashboard" element={<UserDashboard/>} />

          {/* Other Routes */}
          <Route element={<ProtectedRoute/>}> 
            <Route path="/heatmap" element={<Heatmap/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/add-proposals" element={<AddProposal/>} />
            <Route path="/all-proposals" element={<AllProposals/>} />
            
            {/* Existing Routes */}
            <Route path="/your-proposals" element={<YourProposals/>} />
            <Route path="/proposal-detail/:id" element={<ProjectTrackingPage/>} />
          </Route>
        </Routes>
        
        {/* <Footer/> */}
      </div>
    </SocketProvider> 
  );
}

export default App
