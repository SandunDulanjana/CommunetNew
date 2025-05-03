import React from 'react';
import aprtment2 from '../assets/aprtment2.jpg';
import arrow from '../assets/arrow.png';
import { useNavigate } from "react-router-dom";

const HomeHeder = ({ token }) => {
  const navigate = useNavigate();
  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${aprtment2})`,
          transform: 'scale(1.1)',
          filter: 'blur(2px)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-sky-950/90 via-sky-950/70 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-[90vh] flex items-center">
        <div className="max-w-3xl">
          {/* Main Heading with Animation */}
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-tight animate-fade-in">
            A <span className="text-yellow-400">Stronger</span> Community <br />
            <span className="text-yellow-500">Starts Here</span>
          </h1>

          {/* Description Text with Glass Effect */}
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 mb-8 border border-white/20 shadow-2xl">
            <p className="text-lg md:text-2xl text-white font-medium leading-relaxed">
              Welcome to our community! Stay up-to-date with the latest news, important updates, and easy access to HOA services. Connect with your
              neighbors, stay informed, and enjoy the many benefits of being part of our vibrant community.
            </p>
          </div>

          {/* Call-to-Action Button */}
          {!token && (
            <button
              onClick={() => navigate("/Register")}
              className="group relative inline-flex items-center gap-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold px-8 py-4 rounded-full shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="relative z-10">Join With Us</span>
              <img 
                src={arrow} 
                alt="arrow" 
                className="w-8 h-8 rounded-full transition-transform duration-300 group-hover:translate-x-1" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          )}

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <h3 className="text-2xl font-bold text-yellow-400">500+</h3>
              <p className="text-white/80">Happy Residents</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <h3 className="text-2xl font-bold text-yellow-400">50+</h3>
              <p className="text-white/80">Events Yearly</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <h3 className="text-2xl font-bold text-yellow-400">24/7</h3>
              <p className="text-white/80">Security</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 text-center border border-white/20">
              <h3 className="text-2xl font-bold text-yellow-400">100%</h3>
              <p className="text-white/80">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-yellow-400/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-blue-400/20 rounded-full filter blur-3xl" />
    </div>
  );
};

export default HomeHeder;
