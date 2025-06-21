import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight,
  Home, FileText, Globe, Users, Star
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

// SidebarItem Component
const SidebarItem = ({ icon, text, isOpen, to }) => {
  return (
    <NavLink 
      to={to}
      className={({ isActive }) => `
        flex items-center p-4 cursor-pointer
        ${isActive ? 'bg-indigo-700' : 'hover:bg-indigo-700'}
        transition-colors duration-200
      `}
    >
      <div className="text-white">{icon}</div>
      {isOpen && <span className="ml-4 text-white">{text}</span>}
    </NavLink>
  );
};

const Sidebar = ({ isMobileMenuOpen, setMobileMenuOpen }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static z-40 h-screen
        ${isSidebarOpen ? 'w-64' : 'w-20'}
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        bg-indigo-800 text-white transition-all duration-300 ease-in-out
        overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-indigo-900
      `}>
        <div className="sticky top-0 bg-indigo-800 p-4 flex justify-between items-center border-b border-indigo-700">
          <h2 className={`font-bold ${isSidebarOpen ? 'block' : 'hidden'}`}>Dashboard</h2>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-indigo-700 rounded-lg hidden md:block"
          >
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        <nav className="mt-8">
          <SidebarItem 
            icon={<Home />} 
            text="Add Proposals" 
            isOpen={isSidebarOpen} 
            to="/add-proposals"
          />
          <SidebarItem 
            icon={<FileText />} 
            text="Your Proposals" 
            isOpen={isSidebarOpen} 
            to="/your-proposals"
          />
          <SidebarItem 
            icon={<Globe />} 
            text="Regional Proposals" 
            isOpen={isSidebarOpen} 
            to="/all-proposals"
          />
          <SidebarItem 
            icon={<Users />} 
            text="Community" 
            isOpen={isSidebarOpen} 
            to="/community"
          />
          <SidebarItem 
            icon={<Star />} 
            text="Favorites" 
            isOpen={isSidebarOpen} 
            to="/favorites"
          />
        </nav>
      </div>
    </>
  );
};

export default Sidebar;