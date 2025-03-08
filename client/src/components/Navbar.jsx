// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { FiMenu, FiX } from "react-icons/fi";
// import { assets } from "../assets/assets";
// import {useClerk,useUser,UserButton} from '@clerk/clerk-react'


// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { user } = useUser();
//   const {openSignIn} = useClerk();

//   return (
//     <nav className="bg-gray-900 text-white py-4 px-6">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         {/* Left side: Logo and company name */}
//         <div className="flex items-center space-x-3">
//           <img src={assets.logo} alt="Company Logo" />
//           <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-lg font-semibold">
    
//           </motion.span>
//         </div>

//         {/* Right side: Buttons and Hamburger Menu */}
//         <div className="hidden md:flex space-x-4">
//           <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
//             Login
//           </motion.button>
//           {
//             user ? <UserButton /> : <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg" onClick={() => openSignIn()}>
//             Join the Community
//           </motion.button>
//           }
//           {/* <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg" onClick={() => openSignIn()}>
//             Join the Community
//           </motion.button> */}
//         </div>

//         {/* Hamburger Menu */}
//         <div className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
//           {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {menuOpen && (
//         <motion.div
//           className="md:hidden flex flex-col space-y-4 mt-4 bg-gray-800 p-4 rounded-lg"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//         >
//           <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Login</button>
//           <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Join the Community</button>
//         </motion.div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
// import React, { useState } from 'react';
// import { Menu, X, Bell, ChevronDown, User } from 'lucide-react';
// import {useClerk,useUser,UserButton} from '@clerk/clerk-react'


// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const { user } = useUser();
//   const {openSignIn} = useClerk();

//   const navigation = [
//     { name: 'Home', href: '/' },
//     { name: 'Proposals', href: '/proposals' },
//     { name: 'Projects', href: '/projects' },
//     { name: 'Heatmap', href: '/heatmap' },
//     { name: 'About', href: '/about' }
//   ];

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo and brand */}
//           <div className="flex-shrink-0 flex items-center">
//             <span className="text-2xl font-bold text-indigo-600">Aawaaz</span>
//           </div>

//           {/* Desktop navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             {navigation.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//               >
//                 {item.name}
//               </a>
//             ))}
//           </div>

//           {/* Desktop right section */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* Notifications */}
//             <button className="text-gray-600 hover:text-indigo-600 relative p-2">
//               <Bell size={20} />
//               <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
//             </button>

//             {/* User dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 px-3 py-2"
//               >
//                 <User size={20} />
//                 <ChevronDown size={16} />
//               </button>

//               {isDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
//                   <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Profile</a>
//                   <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Settings</a>
//                   <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Logout</a>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-gray-600 hover:text-indigo-600 p-2"
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {navigation.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
//               >
//                 {item.name}
//               </a>
//             ))}
//           </div>
//           <div className="pt-4 pb-3 border-t border-gray-200">
//             <div className="flex items-center px-5">
//               <div className="flex-shrink-0">
//                 <User size={40} className="text-gray-600" />
//               </div>
//               <div className="ml-3">
//                 <div className="text-base font-medium text-gray-800">User Name</div>
//                 <div className="text-sm font-medium text-gray-500">user@example.com</div>
//               </div>
//               <button className="ml-auto text-gray-600 hover:text-indigo-600">
//                 <Bell size={20} />
//               </button>
//             </div>
//             <div className="mt-3 px-2 space-y-1">
//               <a href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">Profile</a>
//               <a href="/settings" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">Settings</a>
//               <a href="/logout" className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50">Logout</a>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
// import React, { useState } from 'react';
// import { Menu, X, Bell, ChevronDown } from 'lucide-react';
// import { useClerk, useUser, UserButton } from '@clerk/clerk-react';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user } = useUser();
//   const { openSignIn } = useClerk();

//   const navigation = [
//     { name: 'Home', href: '/' },
//     { name: 'Proposals', href: '/proposals' },
//     { name: 'Projects', href: '/projects' },
//     { name: 'Heatmap', href: '/heat-map' },
//     { name: 'About', href: '/about' }
//   ];

//   return (
//     <nav className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-sm bg-white/75">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo and brand */}
//           <div className="flex-shrink-0 flex items-center">
//             <span className="text-2xl font-bold text-indigo-600">Aawaaz</span>
//           </div>

//           {/* Desktop navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             {navigation.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//               >
//                 {item.name}
//               </a>
//             ))}
//           </div>

//           {/* Desktop right section */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user ? (
//               <>
//                 {/* Notifications */}
//                 <button className="text-gray-600 hover:text-indigo-600 relative p-2">
//                   <Bell size={20} />
//                   <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
//                 </button>
                
//                 {/* Clerk User Button */}
//                 <UserButton 
//                   afterSignOutUrl="/"
//                   appearance={{
//                     elements: {
//                       avatarBox: "w-8 h-8"
//                     }
//                   }}
//                 />
//               </>
//             ) : (
//               <button
//                 onClick={() => openSignIn()}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
//               >
//                 Join the Community
//               </button>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-gray-600 hover:text-indigo-600 p-2"
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {navigation.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
//               >
//                 {item.name}
//               </a>
//             ))}
//           </div>
//           <div className="pt-4 pb-3 border-t border-gray-200">
//             {user ? (
//               <div className="flex items-center justify-between px-5">
//                 <div className="flex items-center">
//                   <UserButton afterSignOutUrl="/" />
//                   <div className="ml-3">
//                     <div className="text-base font-medium text-gray-800">{user.fullName}</div>
//                     <div className="text-sm font-medium text-gray-500">{user.primaryEmailAddress?.emailAddress}</div>
//                   </div>
//                 </div>
//                 <button className="text-gray-600 hover:text-indigo-600">
//                   <Bell size={20} />
//                 </button>
//               </div>
//             ) : (
//               <div className="px-5">
//                 <button
//                   onClick={() => openSignIn()}
//                   className="w-full flex justify-center bg-indigo-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors"
//                 >
//                   Join the Community
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;


// import React, { useState } from 'react';
// import { Menu, X, Bell } from 'lucide-react';
// import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
// import Notification from './Notification'; // Import Notification Component

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false); // State for notification modal
//   const { user } = useUser();
//   const { openSignIn } = useClerk();

//   const navigation = [
//     { name: 'Home', href: '/' },
//     { name: 'Proposals', href: '/proposals' },
//     { name: 'Projects', href: '/projects' },
//     { name: 'Heatmap', href: '/heat-map' },
//     { name: 'About', href: '/about' }
//   ];

//   return (
//     <nav className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-sm bg-white/75">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo and brand */}
//           <div className="flex-shrink-0 flex items-center">
//             <span className="text-2xl font-bold text-indigo-600">Aawaaz</span>
//           </div>

//           {/* Desktop navigation */}
//           <div className="hidden md:flex items-center space-x-4">
//             {navigation.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
//               >
//                 {item.name}
//               </a>
//             ))}
//           </div>

//           {/* Desktop right section */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user ? (
//               <>
//                 {/* Notifications Button */}
//                 <button
//                   className="text-gray-600 hover:text-indigo-600 relative p-2"
//                   onClick={() => setIsNotificationOpen(true)}
//                 >
//                   <Bell size={20} />
//                   {/* Notification Dot */}
//                   <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
//                 </button>

//                 {/* Clerk User Button */}
//                 <UserButton 
//                   afterSignOutUrl="/"
//                   appearance={{
//                     elements: {
//                       avatarBox: "w-8 h-8"
//                     }
//                   }}
//                 />
//               </>
//             ) : (
//               <button
//                 onClick={() => openSignIn()}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
//               >
//                 Join the Community
//               </button>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden flex items-center">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="text-gray-600 hover:text-indigo-600 p-2"
//             >
//               {isOpen ? <X size={24} /> : <Menu size={24} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile menu */}
//       {isOpen && (
//         <div className="md:hidden">
//           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//             {navigation.map((item) => (
//               <a
//                 key={item.name}
//                 href={item.href}
//                 className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
//               >
//                 {item.name}
//               </a>
//             ))}
//           </div>
//           <div className="pt-4 pb-3 border-t border-gray-200">
//             {user ? (
//               <div className="flex items-center justify-between px-5">
//                 <div className="flex items-center">
//                   <UserButton afterSignOutUrl="/" />
//                   <div className="ml-3">
//                     <div className="text-base font-medium text-gray-800">{user.fullName}</div>
//                     <div className="text-sm font-medium text-gray-500">{user.primaryEmailAddress?.emailAddress}</div>
//                   </div>
//                 </div>
//                 <button
//                   className="text-gray-600 hover:text-indigo-600"
//                   onClick={() => setIsNotificationOpen(true)}
//                 >
//                   <Bell size={20} />
//                 </button>
//               </div>
//             ) : (
//               <div className="px-5">
//                 <button
//                   onClick={() => openSignIn()}
//                   className="w-full flex justify-center bg-indigo-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors"
//                 >
//                   Join the Community
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Notification Modal */}
//       <Notification isOpen={isNotificationOpen} toggleModal={() => setIsNotificationOpen(false)} />
//     </nav>
//   );
// };

// export default Navbar;
import React, { useState } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
import Notification from './Notification';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Proposals', href: '/proposals' },
    { name: 'Projects', href: '/projects' },
    { name: 'Heatmap', href: '/heat-map' },
    { name: 'About', href: '/about' }
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white shadow-md backdrop-blur-sm bg-white/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Aawaaz</span>
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