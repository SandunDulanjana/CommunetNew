import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";  
import profile from "../assets/profile.jpg"
import menu from "../assets/menuicon.png"

const Navbar = () => {

  const navigate = useNavigate();

  const[showMenu,setShowMenu] = useState(false)
  const[token,setToken] = useState(true)


  return (
    <nav className="bg-sky-950 text-white p-4 shadow-lg rounded-b-2xl">
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
          {token && (
            <>
              <li>
                <NavLink
                  to="/Event"
                  className={({ isActive }) =>
                    isActive ? "text-blue-400" : "hover:text-blue-400 transition"
                  }
                >
                  EVENTS
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Election"
                  className={({ isActive }) =>
                    isActive ? "text-blue-400" : "hover:text-blue-400 transition"
                  }
                >
                  ELECTIONS
                </NavLink>
              </li>
            </>
          )}
        </ul>

        
        <div className="ml-auto">
          {
            token
            ?<div className="flex items-center gap-2 cursor-pointer group relative">
             <img src = {profile} alt="profile photo" className="h-11 w-11 rounded-full"/>
             <img src = {menu} alt="profile photo" className="h-10 w-10 rounded-full"/>
             <div className="absolute top-0 right-0 pt-14 text-base font-medium text-stone-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-white rounded flex flex-col gap-4 p-4">
                <p onClick={()=> navigate('RUserProfile')} className="hover:text-black cursor-pointer">My Profile</p>
                <p onClick={()=> navigate('MyEvents')} className="hover:text-black cursor-pointer">My Event</p>
                <p onClick={()=> navigate('MyMaintance')} className="hover:text-black cursor-pointer">My Maintance</p>
                <p
                  onClick={() => {
                    setToken(false);  // Set token to false
                    navigate("/login");  // Navigate to the login page
                  }}
                  className="hover:text-black cursor-pointer"
                >
                  Logout
                </p>
              </div>
             </div>
            </div>
            :<button onClick={() => navigate("/Register", { state: { token } })} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"> SingUp </button>
           
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
