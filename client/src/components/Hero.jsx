import React from 'react';
import { ChevronRight, Users, Vote, LineChart } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';


const Hero = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
    const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage:  `url(${assets.com})`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Your Voice in
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"> Community Development</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8">
              Bridge the gap between citizens and elected representatives. Propose projects, vote on initiatives, and track progress in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {!user && (
                <button
                  onClick={() => openSignIn()}
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Join the Movement
                  <ChevronRight className="ml-2" size={20} />
                </button>
              )}
              <a
                
                className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-indigo-600 transition-colors" onClick={()=>navigate('/user-dashboard')}
              >
                View Projects
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 lg:gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Users className="text-indigo-300" size={24} />
                </div>
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-indigo-200 text-sm">Active Citizens</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <Vote className="text-indigo-300" size={24} />
                </div>
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-indigo-200 text-sm">Projects Proposed</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <LineChart className="text-indigo-300" size={24} />
                </div>
                <div className="text-2xl font-bold text-white">85%</div>
                <div className="text-indigo-200 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right column - Image/Illustration */}
          <div className="relative">
            <div className="relative rounded-lg overflow-hidden shadow-2xl">
              <img
                src={assets.com}
                alt="Community Development"
                className="w-full h-full object-cover"
              />
              {/* Overlay Cards */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="text-sm font-semibold text-indigo-600">Latest Project</div>
                  <div className="text-xs text-gray-600">Community Park Renovation</div>
                </div>
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="text-sm font-semibold text-green-600">95% Supported</div>
                  <div className="text-xs text-gray-600">by local residents</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;