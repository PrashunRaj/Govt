import React from 'react';
import { 
  Users, Vote, MapPin, Bell, BarChart3, Shield, 
  Clock, MessageSquare, CheckCircle , FileText
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Submit Proposals",
      description: "Easily submit your ideas for community development projects with detailed descriptions and budget estimates.",
      color: "text-blue-600"
    },
    {
      icon: <Vote className="w-6 h-6" />,
      title: "Democratic Voting",
      description: "Vote on proposals that matter to you and see real-time results from your community members.",
      color: "text-green-600"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Location-Based",
      description: "View and participate in proposals specific to your constituency",
      color: "text-purple-600"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Get instant notifications about proposal status changes, voting results",
      color: "text-orange-600"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Monitor the implementation progress of approved projects with detailed timelines and milestones.",
      color: "text-indigo-600"
    },
    // {
    //   icon: <Users className="w-6 h-6" />,
    //   title: "MLA Connectivity",
    //   description: "Direct communication channel with your elected representatives for transparency and accountability.",
    //   color: "text-red-600"
    // },
    // {
    //   icon: <Shield className="w-6 h-6" />,
    //   title: "Secure Platform",
    //   description: "Your data and votes are protected with enterprise-grade security and authentication.",
    //   color: "text-teal-600"
    // },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Community Discussion",
      description: "Engage in meaningful discussions about proposals with fellow community members.",
      color: "text-pink-600"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Verified Results",
      description: "All voting results and project outcomes are transparent and verifiable by the community.",
      color: "text-emerald-600"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover the powerful features that make community participation simple, 
            transparent, and effective for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 hover:border-indigo-300"
            >
              <div className={`${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 bg-indigo-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Save Time</h4>
              <p className="text-sm text-gray-600">Streamlined process for proposal submission and voting</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Transparency</h4>
              <p className="text-sm text-gray-600">Complete visibility into project progress and outcomes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Community Impact</h4>
              <p className="text-sm text-gray-600">Real change driven by collective community voice</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Data-Driven</h4>
              <p className="text-sm text-gray-600">Make informed decisions with comprehensive analytics</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
