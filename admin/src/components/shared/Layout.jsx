import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { 
  Home, 
  Users, 
  UserCheck, 
  FileText, 
  User, 
  LogOut, 
  Menu, 
  X,
  Shield
} from 'lucide-react';

const Layout = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home},
    { name: 'MLA Management', href: '/mla-management', icon: UserCheck },
    { name: 'User Management', href: '/user-management', icon: Users },
    // { name: 'Proposal Overview', href: '/proposal-overview', icon: FileText },
    // { name: 'Profile', href: '/profile', icon: User },
  ];
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 z-50`}>
        
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 bg-indigo-600">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">Admin Portal</span>
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        {/* User info and logout */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-4">
            <img
              className="h-10 w-10 rounded-full"
              src={user?.imageUrl || "/api/placeholder/40/40"}
              alt="Admin"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName || 'Admin'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              className="md:hidden text-gray-500 hover:text-gray-900"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <h1 className="text-2xl font-semibold text-gray-900">
              {navigation.find(item => item.href === location.pathname)?.name || 'Admin Dashboard'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.firstName || 'Admin'}
              </span>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
