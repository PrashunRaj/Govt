import React from 'react';
import { assets } from '../assets/assets';
import { 
  MapPin, Phone, Mail, Facebook, Twitter, 
  Linkedin, FileText, Users, Vote, Globe 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <img className="mb-4 w-40" src={assets.logo} alt="Community Voice" />
            <p className="text-gray-300 leading-6 mb-6">
              Empowering citizens to participate in community development through transparent 
              proposal submission, democratic voting, and direct engagement with elected representatives. 
              Building stronger communities, one proposal at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Home
                </a>
              </li>
              <li>
                <a href="/user-dashboard" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Submit Proposal
                </a>
              </li>
              <li>
                <a href="/all-proposals" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <Vote className="w-4 h-4 mr-2" />
                  Browse Proposals
                </a>
              </li>
              <li>
                <a href="/heatmap" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Community Heatmap
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-300 text-sm">
                Ranchi, India
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-300 text-sm">
                +91 11 2345-6789
              </span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-300 text-sm">
                info@communityvoice.gov.in
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2025 Community Voice Platform. All rights reserved.
            </p>
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
