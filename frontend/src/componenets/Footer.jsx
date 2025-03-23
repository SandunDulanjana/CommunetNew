import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-sky-950 text-white p-6 mt-8 shadow-lg rounded-t-2xl">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-12 rounded-full" />
          <h1 className="font-bold mt-2 ml-2">COMMUNET</h1>
        </div>

        <ul className="flex flex-col md:flex-row mt-4 md:mt-0 space-y-4 md:space-y-0 md:space-x-8 mx-auto">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "hover:text-blue-400 transition"
              }
            >
              HOME
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/AboutUs"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "hover:text-blue-400 transition"
              }
            >
              ABOUT US
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ContactUs"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "hover:text-blue-400 transition"
              }
            >
              CONTACT US
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/rules"
              className={({ isActive }) =>
                isActive ? "text-blue-400" : "hover:text-blue-400 transition"
              }
            >
              RULES
            </NavLink>
          </li>
        </ul>

        <div className="mt-4 md:mt-0">
          <p className="text-sm text-center md:text-left">
            © 2025 COMMUNET. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
