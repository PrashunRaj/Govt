
import React, { useState } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
import Notification from './Notification';
import Logo from './Logo'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const navigation = [
    { name: 'Home', href: '/' },
    // { name: 'Proposals', href: '/proposals' },
    // { name: 'Projects', href: '/projects' },
   
    { name: 'About', href: '/about' },
     { name: 'Contact Us', href: '/contact' }
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white shadow-md backdrop-blur-sm bg-white/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <Logo size="medium" />
              
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    className="text-gray-600 hover:text-indigo-600 relative p-2"
                    onClick={() => setIsNotificationOpen(true)}
                  >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
                  </button>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </>
              ) : (
                <button
                  onClick={() => openSignIn()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Join the Community
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:text-indigo-600 p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
                <div className="flex items-center justify-between px-5">
                  <div className="flex items-center">
                    <UserButton afterSignOutUrl="/" />
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.fullName}</div>
                      <div className="text-sm font-medium text-gray-500">{user.primaryEmailAddress?.emailAddress}</div>
                    </div>
                  </div>
                  <button
                    className="text-gray-600 hover:text-indigo-600"
                    onClick={() => setIsNotificationOpen(true)}
                  >
                    <Bell size={20} />
                  </button>
                </div>
              ) : (
                <div className="px-5">
                  <button
                    onClick={() => openSignIn()}
                    className="w-full flex justify-center bg-indigo-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Join the Community
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <Notification isOpen={isNotificationOpen} toggleModal={() => setIsNotificationOpen(false)} />
    </>
  );
};

export default Navbar;