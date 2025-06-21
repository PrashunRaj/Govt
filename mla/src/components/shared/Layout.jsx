import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  HomeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserIcon,
  Cog6ToothIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import logoImage from "../../assets/react.svg";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  // Show loading while Clerk is checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Redirect to login if user is not signed in
  if (!user) {
    return <Navigate to="/mla/login" replace />;
  }
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/mla/login');
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/mla/dashboard', icon: HomeIcon },
    { name: 'Proposal Map', href: '/mla/proposal-mapping', icon:  MapPinIcon },
    { name: 'Analytics', href: '/mla/analytics', icon: ChartBarIcon },
    { name: 'Profile', href: '/mla/profile', icon: UserIcon },
    { name: 'Proposals', href: '/mla/proposals', icon:  ClipboardDocumentListIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
          <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <img className="h-8 w-auto" src={logoImage} alt="Aawaaz" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Aawaaz MLA</span>
              <button
                type="button"
                className="ml-auto rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <nav className="mt-5 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 flex-shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="group block w-full flex items-center"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}
                    </p>
                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">Sign out</p>
                  </div>
                </div>
                <ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <img className="h-8 w-auto" src={logoImage} alt="Aawaaz" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Aawaaz MLA</span>
            </div>
            
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <button
              onClick={handleSignOut}
              className="group block w-full flex items-center"
            >
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.username}
                    </p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Sign out</p>
                  </div>
                </div>
                <ArrowLeftOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Top navbar */}
        <div className="flex-1">
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <div className="flex flex-1 justify-between px-4 md:px-0">
              <div className="flex flex-1">
                <div className="flex w-full md:ml-0">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">
                      {navigation.find(item => item.href === location.pathname)?.name || 'MLA Portal'}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                {/* Notification dropdown */}
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-xs font-medium text-white">3</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
