import React from 'react';
import { UserPlus, FileText, Vote, CheckCircle, TrendingUp } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Sign Up & Complete Profile",
      description: "Create your account and set up your profile with your constituency details to get started.",
      color: "bg-blue-500"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Browse & Submit Proposals",
      description: "Explore existing proposals in your area or submit your own ideas for community development.",
      color: "bg-green-500"
    },
    {
      icon: <Vote className="w-8 h-8" />,
      title: "Vote & Engage",
      description: "Support proposals you believe in by voting and engaging in community discussions.",
      color: "bg-purple-500"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "MLA Review & Approval",
      description: "Your elected representatives review and approve proposals based on community support.",
      color: "bg-indigo-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Track Implementation",
      description: "Monitor the progress of approved projects and see the real impact in your community.",
      color: "bg-orange-500"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform makes it easy for citizens to participate in community development. 
            Follow these simple steps to make your voice heard.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Timeline */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Number Circle */}
                <div className={`${step.color} w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 relative z-10 shadow-lg`}>
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="text-gray-600">
                    {step.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Mobile Arrow */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-6">
                    <div className="w-0.5 h-8 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default HowItWorks;
