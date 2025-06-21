import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import admin pages
import AdminLogin from './pages/AdminLogin.jsx';
import Home from './pages/Home.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MlaManagement from './pages/MlaManagement.jsx';
import UserManagement from './pages/UserManagement.jsx';
import ProposalOverview from './pages/ProposalOverview.jsx';

// Import admin components
import Layout from './components/shared/Layout.jsx';
import ProtectedRoute from './components/shared/ProtectedRoute.jsx';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<AdminLogin />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/mla-management" element={<MlaManagement />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/proposal-overview" element={<ProposalOverview />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
