import React from 'react';
import Footer from '../componenets/Footer';
import HomeHeader from '../componenets/HomeHeder';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header Section */}
      <HomeHeader />

      {/* Introduction Section */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 text-lg leading-relaxed">
        <p className="text-center text-2xl font-bold text-gray-900 mb-6">
          Welcome to Our Apartment Community
        </p>
        <p className="text-gray-700 text-center">
          Experience modern living with a vibrant, well-connected, and secure apartment community. We provide top-notch amenities, seamless communication, and efficient management to enhance your lifestyle.
        </p>
      </div>

      {/* Features Section */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 pb-12 grid gap-6 md:grid-cols-2">
        {[
          { title: "Luxury Amenities", description: "Enjoy swimming pools, gyms, lounges, and green spaces designed for relaxation and socializing." },
          { title: "Security & Safety", description: "24/7 surveillance, gated entry, and responsive security teams ensure a safe living environment." },
          { title: "Community Events", description: "Participate in social gatherings, cultural festivals, and interactive resident meetups." },
          { title: "Maintenance Requests", description: "Easily report and track maintenance issues to keep your home in top condition." },
          { title: "Resident Services", description: "Access billing, lease information, and personalized services at your convenience." },
        ].map((feature, index) => (
          <div key={index} className="bg-white p-6 shadow-md rounded-lg border-l-4 border-blue-600">
            <p className="text-xl font-bold text-gray-900 mb-2">{feature.title}</p>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center py-8">
        <p className="text-gray-700 text-lg mb-4">
          Join a welcoming, well-managed apartment community where comfort meets convenience.
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Explore More
        </button>
      </div>

      {/* Footer Section */}
      <Footer />
    </div>
  );
}

export default Home;
