import React from 'react';
import { 
  MapPin, Phone, Mail, Clock, Globe
} from 'lucide-react';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Office Address",
      details: [
        "Community Development Center",
        "Ranchi,834001",
        "India"
      ],
      color: "text-blue-600"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Numbers",
      details: [
        "+91 11 2345-6789",
        "+91 98765-43210"
      ],
      color: "text-green-600"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Addresses",
      details: [
        "info@communityvoice.gov.in",
        "support@communityvoice.gov.in"
      ],
      color: "text-purple-600"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Office Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 4:00 PM"
      ],
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600">
            Get in touch with us for any questions or support.
          </p>
        </div>

        {/* Contact Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className={`${info.color} mb-4`}>
                {info.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {info.title}
              </h3>
              <div className="space-y-2">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">
                    {detail}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Department Contacts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Department Contacts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Proposal Support
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                For proposal submission and tracking
              </p>
              <a 
                href="mailto:proposals@communityvoice.gov.in"
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                proposals@communityvoice.gov.in
              </a>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                Technical Support
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                For platform issues and help
              </p>
              <a 
                href="mailto:tech@communityvoice.gov.in"
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                tech@communityvoice.gov.in
              </a>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                MLA Coordination
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                For MLA-related queries
              </p>
              <a 
                href="mailto:mla@communityvoice.gov.in"
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                mla@communityvoice.gov.in
              </a>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                General Inquiries
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                For general questions and feedback
              </p>
              <a 
                href="mailto:info@communityvoice.gov.in"
                className="text-indigo-600 hover:text-indigo-700 text-sm"
              >
                info@communityvoice.gov.in
              </a>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center flex items-center justify-center">
            <Globe className="w-5 h-5 mr-2" />
            Follow Us
          </h3>
          <div className="flex justify-center space-x-6">
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Facebook
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              Twitter
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-700 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
