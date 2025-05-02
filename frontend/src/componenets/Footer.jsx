import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa"; // Importing social media icons

const Footer = () => {
  return (
    
      <footer className="bg-gradient-to-r from-sky-950 to-indigo-900 text-white p-8 mt-8 shadow-xl rounded-t-3xl">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-16 w-16 rounded-full shadow-lg" />
            <h1 className="font-bold text-3xl ml-4 text-gradient">COMMUNET</h1>
          </div>

          {/* Navigation Links */}
          <ul className="flex flex-col md:flex-row mt-6 md:mt-0 space-y-4 md:space-y-0 md:space-x-10 text-lg">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-blue-400 font-semibold" : "hover:text-blue-400 transition"
                }
              >
                HOME
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/AboutUs"
                className={({ isActive }) =>
                  isActive ? "text-blue-400 font-semibold" : "hover:text-blue-400 transition"
                }
              >
                ABOUT US
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/ContactUs"
                className={({ isActive }) =>
                  isActive ? "text-blue-400 font-semibold" : "hover:text-blue-400 transition"
                }
              >
                CONTACT US
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/rules"
                className={({ isActive }) =>
                  isActive ? "text-blue-400 font-semibold" : "hover:text-blue-400 transition"
                }
              >
                RULES
              </NavLink>
            </li>
          </ul>

          {/* Social Media Icons */}
          <div className="mt-6 md:mt-0 flex space-x-6">
            <a
              href="https://facebook.com"
              className="text-white hover:text-blue-500 transition duration-300"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              className="text-white hover:text-blue-400 transition duration-300"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              className="text-white hover:text-pink-500 transition duration-300"
            >
              <FaInstagram size={24} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-sm md:text-base">
            © 2025 <span className="font-semibold">COMMUNET</span>. All rights reserved.
          </p>
        </div>
      </footer>
  );
};

export default Footer;
