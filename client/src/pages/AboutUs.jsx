import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About Aawaaz</h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Aawaaz is a community-driven platform designed to amplify the voices of citizens and bridge the gap between them and their elected representatives. We believe in empowering communities to actively participate in shaping their future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-8 transition duration-300 hover:scale-105 hover:bg-gray-200 cursor-pointer relative">
            <div className="absolute top-4 right-4">
              {/* <img src="/path/to/your/image.svg" alt="Mission Icon" className="w-16 h-16" /> */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-600 leading-relaxed">
              To foster transparency, public engagement, and accountability in governance by providing a platform for citizens to propose, prioritize, and track community development projects.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 transition duration-300 hover:scale-105 hover:bg-gray-200 cursor-pointer relative">
            <div className="absolute top-4 right-4">
              {/* <img src="/path/to/your/image.svg" alt="Vision Icon" className="w-16 h-16" /> */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-600 leading-relaxed">
              To create a more inclusive and responsive governance system where every voice is heard and every community has the opportunity to thrive.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 transition duration-300 hover:scale-105 hover:bg-gray-200 cursor-pointer relative">
            <div className="absolute top-4 right-4">
              {/* <img src="/path/to/your/image.svg" alt="Values Icon" className="w-16 h-16" /> */}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Values</h3>
            <ul className="list-disc pl-5 text-gray-600 leading-relaxed">
              <li>Transparency</li>
              <li>Community Engagement</li>
              <li>Accountability</li>
              <li>Empowerment</li>
              <li>Innovation</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 leading-relaxed">
            Learn more about how Aawaaz is making a difference in communities. We encourage you to explore the platform and join us in building a better future.
          </p>
          <a
            href="/explore"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 hover:scale-105"
          >
            Explore Aawaaz
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;