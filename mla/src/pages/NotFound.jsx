import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const NotFound = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Implement search functionality or redirect to search page
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const popularPages = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Proposals', path: '/proposals', icon: MagnifyingGlassIcon },
    { name: 'Analytics', path: '/analytics', icon: ExclamationTriangleIcon },
    { name: 'Profile', path: '/profile', icon: ChatBubbleLeftRightIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            {/* Animated 404 Text */}
            <div className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 animate-pulse">
              404
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-0 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-8 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-8 left-1/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, let's get you back on track!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for pages, proposals, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Go Home</span>
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Popular Pages
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularPages.map((page, index) => (
              <button
                key={index}
                onClick={() => navigate(page.path)}
                className="group bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <page.icon className="h-8 w-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3 transition-colors" />
                <span className="text-gray-700 group-hover:text-blue-600 font-medium transition-colors">
                  {page.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Need Help?
          </h3>
          <p className="text-gray-600 mb-4">
            If you believe this is an error or need assistance, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
              <ChatBubbleLeftRightIcon className="h-4 w-4" />
              <span>Live Chat</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
              <PhoneIcon className="h-4 w-4" />
              <span>Call Support</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Error Code: 404 | Page Not Found</p>
          <p className="mt-1">
            © 2025 Aawaaz Platform. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
