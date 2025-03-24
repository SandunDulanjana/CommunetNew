import React from 'react'
import aprtment2 from '../assets/aprtment2.jpg'
import arrow from '../assets/arrow.png'
import { NavLink, useNavigate } from "react-router-dom";

const HomeHeder = ({ token }) => {
    const navigate = useNavigate();
  return (
    <div
      className="relative bg-cover bg-center h-[80vh] w-full mt-5 rounded-2xl overflow-hidden"
      style={{ backgroundImage: `url(${aprtment2})` }}
    >
      {/* Overlay for subtle blur effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-2xl"></div>

      {/* Content Section */}
      <div className="relative z-10 md:w-1/2 flex flex-col items-start justify-center gap-6 px-6 md:px-12 py-10 m-auto md:py-[10vw]">
        {/* Main Heading */}
        <p className="text-3xl md:text-5xl text-red-700 font-bold leading-tight md:leading-tight lg:leading-tight font-roboto">
          A STRONGER COMMUNITY <br /> Start Here
        </p>

        {/* Description Text */}
        <div className="text-lg md:text-2xl text-white font-medium font-roboto bg-black/20 p-4 rounded-xl">
          <p>
            Welcome to our community! Stay up-to-date with the latest news,
            important updates, and easy access to HOA services. Connect with your
            neighbors, stay informed, and enjoy the many benefits of being part of
            our vibrant community.
          </p>
        </div>

        {/* Call-to-Action Button (Only shown if token doesn't exist) 
        {token && (
        <button
          onClick={() => {
            navigate("/Register"); // Navigate to the login page
          }}
          className="flex items-center gap-2 bg-cyan-800 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-800 transition"
        >
          Join With Us
          <img src={arrow} alt="arrow" className="w-6 h-6 rounded-full" />
        </button>
      )}*/}
      </div>
    </div>
  );
};

export default HomeHeder;
