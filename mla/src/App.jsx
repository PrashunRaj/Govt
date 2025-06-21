// App.jsx for MLA application
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MLALogin from './pages/MLALogin';
import ProjectManagementPage from './pages/ProjectManagementPage';
import ProposalsPage from './pages/ProposalsPage';
import ProposalDetailPage from './pages/ProposalDetailPage';
import ProposalMapPage from './pages/ProposalMapPage';
// import ProjectsPage from './pages/ProjectsPage';
// import ProjectDetailPage from './pages/ProjectDetailPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
//import ProjectTrackingPage from './pages/ProjectTrackingPage';
import ProtectedRoute from './components/shared/ProtectedRoute';
import NotFound from './pages/NotFound';
import Home from './pages/Home';

// Replace with your actual Clerk publishable key


function App() {
  return (
        
        <Routes>
          {/* Public routes */}
          <Route path="/mla/dashboard" element={<Home />} />
          <Route path="/mla/login" element={<MLALogin />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/mla/manage/:id" element={<ProjectManagementPage />} />
            <Route path="/mla/proposals" element={<ProposalsPage />} />
            <Route path="/mla/proposals/:id" element={<ProposalDetailPage />} />
           <Route path="/mla/proposal-mapping" element={<ProposalMapPage />} />
            {/* <Route path="/projects/:id" element={<ProjectDetailPage />} />  */}
            <Route path="/mla/analytics" element={<AnalyticsPage />} />
            <Route path="/mla/profile" element={<ProfilePage />} />
          </Route>
          
          {/* Default route */}
          <Route path="/" element={<Navigate to="/mla/login" replace />} />
          
          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
      
    
  );
}

export default App;