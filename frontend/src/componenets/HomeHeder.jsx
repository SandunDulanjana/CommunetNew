import React from 'react';
import aprtment2 from '../assets/aprtment2.jpg';
import arrow from '../assets/arrow.png';
import { useNavigate } from "react-router-dom";

const HomeHeder = ({ token }) => {
  const navigate = useNavigate();
  return (
    <div
      className="relative bg-cover bg-center h-[100vh] w-full mt-5 rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-500"
      style={{ backgroundImage: `url(${aprtment2})` }}
    >
      {/* Overlay for a more refined effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-lg rounded-2xl"></div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-start justify-center gap-5 px-6 md:px-16 py-8 md:py-[8vw] max-w-2xl animate-fade-in">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-7xl text-white font-extrabold leading-tight tracking-wide drop-shadow-xl">
          A <span className="text-yellow-400">Stronger</span> Community <br /> <span className="text-yellow-500">Starts Here</span>
        </h1>

        {/* Description Text */}
        <p className="text-lg md:text-2xl text-white font-medium bg-black/50 p-5 rounded-xl shadow-xl leading-relaxed border-l-4 border-yellow-400">
          Welcome to our community! Stay up-to-date with the latest news, important updates, and easy access to HOA services. Connect with your
          neighbors, stay informed, and enjoy the many benefits of being part of our vibrant community.
        </p>

        {/* Call-to-Action Button (Only shown if token doesn't exist) */}
        {!token && (
          <button
            onClick={() => navigate("/Register")}
            className="flex items-center gap-4 bg-yellow-500 text-black font-bold px-8 py-4 rounded-full shadow-2xl hover:bg-yellow-600 transition-transform transform hover:scale-110 ring-4 ring-yellow-300 hover:ring-yellow-400"
          >
            Join With Us
            <img src={arrow} alt="arrow" className="w-8 h-8 rounded-full" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeHeder;
