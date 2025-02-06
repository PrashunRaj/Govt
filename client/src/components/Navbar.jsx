import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Left side: Logo and company name */}
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="Company Logo" className="w-10 h-10" />
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-lg font-semibold">
            CompanyName
          </motion.span>
        </div>

        {/* Right side: Buttons and Hamburger Menu */}
        <div className="hidden md:flex space-x-4">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Login
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Join the Community
          </motion.button>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={30} /> : <FiMenu size={30} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className="md:hidden flex flex-col space-y-4 mt-4 bg-gray-800 p-4 rounded-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Login</button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Join the Community</button>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
