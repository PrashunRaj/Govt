import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  Home, FileText, Globe, Users,
  Menu, X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Add Proposals', path: '/add-proposals', icon: <Home /> },
  { name: 'Your Proposals', path: '/your-proposals', icon: <FileText /> },
  { name: 'Regional Proposals', path: '/all-proposals', icon: <Globe /> },
  { name: 'Heatmap', path: '/heatmap', icon: <Users /> },
  { name: 'Your Profile', path: '/profile', icon: <Users /> },
];

const SidebarItem = ({ icon, text, to, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => `
        flex items-center p-4 cursor-pointer
        ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'}
        transition-colors duration-200 text-white
      `}
    >
      <div>{icon}</div>
      <span className="ml-4">{text}</span>
    </NavLink>
  );
};

const Layout = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking on nav items
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ✅ FIXED: Desktop Sidebar - Fixed width, no resizing */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-1 bg-indigo-800 text-white">
          {/* Sidebar Header */}
          <div className="flex items-center justify-center p-4 border-b border-indigo-700">
            <h2 className="text-lg font-bold">Dashboard</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-6">
            {navigation.map((item) => (
              <SidebarItem
                key={item.name}
                icon={item.icon}
                text={item.name}
                to={item.path}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* ✅ Mobile Sidebar - Slide in/out */}
      <div className={`
        fixed z-50 h-full bg-indigo-800 text-white flex flex-col top-0 left-0 w-64
        transition-transform duration-300 ease-in-out md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-indigo-700">
          <h2 className="text-lg font-bold">Dashboard</h2>
          <button
            className="p-2 hover:bg-indigo-700 rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 mt-6">
          {navigation.map((item) => (
            <SidebarItem
              key={item.name}
              icon={item.icon}
              text={item.name}
              to={item.path}
              onClick={handleMobileNavClick}
            />
          ))}
        </nav>
      </div>

      {/* ✅ FIXED: Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile header bar */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* ✅ FIXED: Content area - properly constrained */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
