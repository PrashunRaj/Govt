// import React from "react";
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-8 px-6 fixed bottom-0 w-full">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Navigation Links */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
//           <ul className="space-y-2">
//             <li><a href="#" className="hover:text-blue-400">Home</a></li>
//             <li><a href="#" className="hover:text-blue-400">About</a></li>
//             <li><a href="#" className="hover:text-blue-400">Services</a></li>
//             <li><a href="#" className="hover:text-blue-400">Contact</a></li>
//           </ul>
//         </div>

//         {/* Social Media Links */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
//           <div className="flex space-x-4">
//             <a href="#" className="text-xl hover:text-blue-400"><FaFacebook /></a>
//             <a href="#" className="text-xl hover:text-blue-400"><FaTwitter /></a>
//             <a href="#" className="text-xl hover:text-blue-400"><FaInstagram /></a>
//             <a href="#" className="text-xl hover:text-blue-400"><FaLinkedin /></a>
//           </div>
//         </div>

//         {/* Additional Section (Newsletter or Contact) */}
//         <div>
//           <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
//           <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
//           <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 rounded-md text-gray-900 focus:outline-none" />
//           <button className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">Subscribe</button>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* left section */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>At Awwaz, we are committed to building a greener future. By connecting individuals with sustainability experts in waste management, energy solutions, and urban farming, we aim to inspire meaningful change in communities worldwide. Together, let's create a planet we can proudly pass on to the next generation.</p>

           </div>
            {/* center section */}
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600 '>
                    <li>Home</li>
                    <li>About us</li>
                    <li>contact us</li>
                    <li>Privacy Policy</li>
                </ul>

           </div>

            {/* right section */}
            <div>
                <p  className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600 '>
                    <li>+8434013295</li>
                    <li>JKA@gmail.com</li>
                </ul>

           </div>
        </div>
        <div>
            {/* copyright-text */}
            <hr/>
            <p className='py-5 text-sm text-center'>Copyright 2025 @ Awaaz - All Right Reserved.</p>
        </div>

    </div>
    
  )
}

export default Footer

// Navbar.jsx
// import React from 'react';
// import { NavLink } from 'react-router-dom';

// const Navbar = () => {
//   return (
//     <nav className="bg-gray-800 py-4">
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         <div className="text-lg font-bold text-white">
//           <NavLink to="/">Your Website</NavLink>
//         </div>
//         <ul className="flex items-center space-x-4">
//           <li>
//             <NavLink
//               to="/"
//               className={({ isActive }) =>
//                 `text-gray-300 hover:text-white transition duration-300 ${
//                   isActive ? 'text-white' : ''
//                 }`
//               }
//             >
//               Home
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/about"
//               className={({ isActive }) =>
//                 `text-gray-300 hover:text-white transition duration-300 ${
//                   isActive ? 'text-white' : ''
//                 }`
//               }
//             >
//               About
//             </NavLink>
//           </li>
//           <li>
//             <NavLink
//               to="/contact"
//               className={({ isActive }) =>
//                 `text-gray-300 hover:text-white transition duration-300 ${
//                   isActive ? 'text-white' : ''
//                 }`
//               }
//             >
//               Contact
//             </NavLink>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;