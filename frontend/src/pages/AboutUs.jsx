import React from 'react';
import Footer from '../componenets/Footer';
import aboutusImg from '../assets/aboutus.jpg'
import presidentImg from '../assets/president.jpeg'
import vicetImg from '../assets/vice.jpeg'
import treshImg from '../assets/tresh.jpeg'

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-blue-600">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src={aboutusImg}
            alt="Community Aerial View"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">About Our Community</h1>
              <p className="text-xl">Building a better neighborhood together since 1995</p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To create and maintain a vibrant, safe, and harmonious community where residents can enjoy a high quality of life. We strive to preserve property values, promote community engagement, and ensure the well-being of all our residents through effective management and thoughtful decision-making.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To be recognized as a model community that sets the standard for excellence in residential living. We envision a neighborhood where residents take pride in their homes, actively participate in community life, and work together to create an environment that fosters lasting relationships and lasting value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Board Members */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Board Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={presidentImg}
                  alt="Board Member"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">John Smith</h3>
                  <p className="text-blue-600 mb-2">President</p>
                  <p className="text-gray-600">Serving the community since 2018</p>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={vicetImg}
                  alt="Board Member"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                  <p className="text-blue-600 mb-2">Vice President</p>
                  <p className="text-gray-600">Serving the community since 2019</p>
                </div>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <img
                  src={treshImg}
                  alt="Board Member"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Michael Brown</h3>
                  <p className="text-blue-600 mb-2">Treasurer</p>
                  <p className="text-gray-600">Serving the community since 2020</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Values */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Community Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Community</h3>
                <p className="text-gray-600">Building strong relationships</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Integrity</h3>
                <p className="text-gray-600">Honest and transparent operations</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600">Striving for the highest standards</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Sustainability</h3>
                <p className="text-gray-600">Building for the future</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;