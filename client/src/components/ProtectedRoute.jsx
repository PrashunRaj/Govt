// ProtectedRoute.jsx - For authentication protection
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Layout from './Layout';

const ProtectedRoute = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  console.log('isLoaded:', isLoaded);
console.log('isSignedIn:', isSignedIn);
console.log('user role:', user?.publicMetadata?.role);
  
  // Show loading indicator while Clerk loads
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Check if user is signed in and has MLA role
  // if (!isSignedIn) {
  //   return <Navigate to="/login" replace />;
  // }
  
  // Check if user has MLA role in metadata
  // const isMLA = user.publicMetadata?.role === 'mla';
  // if (!isMLA) {
  //   return <Navigate to="/login" replace />;
  // }
  
  // If authenticated as MLA, render the child routes within the Layout
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default ProtectedRoute;