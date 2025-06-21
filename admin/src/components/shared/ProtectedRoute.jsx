import React, { useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { user, isLoaded } = useUser();
  
  // ✅ FIXED: Use useMemo to prevent infinite re-renders
  const adminEmails = useMemo(() => [
    'rajprashun386b@gmail.com',  // Replace with your actual admin email
    'admin2@yourapp.com'  // Add more admin emails as needed
  ], []);
  
  // ✅ FIXED: Memoize admin check to prevent re-calculation on every render
  const isAdmin = useMemo(() => {
    if (!user || !user.emailAddresses?.[0]?.emailAddress) return false;
    return adminEmails.includes(user.emailAddresses[0].emailAddress);
  }, [user, adminEmails]);
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // ✅ FIXED: Simple conditional rendering without causing re-renders
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
