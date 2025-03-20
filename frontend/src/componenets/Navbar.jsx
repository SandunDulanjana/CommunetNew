import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";  

const Navbar = () => {
  return (
    <nav className="bg-sky-950 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
       
      <img src={logo} alt="My Website Logo" className="h-12 w-12 rounded-full" />
      <h1 className="font-bold mt-2 ml-2">COMMUNET</h1>

        
        <ul className="flex space-x-6 mx-auto">
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

        
        <div className="ml-auto">
          <NavLink
            to="/Register"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign In
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
