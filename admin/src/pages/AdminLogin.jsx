import React, { useMemo } from 'react';
import { SignIn, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const AdminLogin = () => {
  const { user, isLoaded } = useUser();
  
  // ✅ FIXED: Use useMemo to prevent re-calculation
  const adminEmails = useMemo(() => [
    'rajprashun386b@gmail.com',  // Replace with your actual admin email
    'admin2@yourapp.com'
  ], []);
  
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
  
  // ✅ FIXED: Redirect admin users to dashboard
  if (user && isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // ✅ FIXED: Show access denied for non-admin authenticated users
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-4">This account is not authorized for admin access.</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Show login form for unauthenticated users
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h2>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <SignIn 
            appearance={{
              elements: {
                footer: { display: 'none' },
                card: { 
                  boxShadow: 'none',
                  border: 'none'
                },
                headerTitle: { display: 'none' },
                headerSubtitle: { display: 'none' },
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
