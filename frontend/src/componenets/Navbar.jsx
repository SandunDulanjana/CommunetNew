import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";  
import profile from "../assets/profile.jpg";
import menu from "../assets/menuicon.png";
import axios from "axios";
import { FiBell } from 'react-icons/fi';


const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(!!localStorage.getItem("token"));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const [userImage, setUserImage] = useState(null);
  const userType = localStorage.getItem("type");

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Fetch user profile image when token changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      const tokenValue = localStorage.getItem("token");
      if (!tokenValue) {
        setUserImage(null);
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/ProfileRouter/displayMember", {
          headers: { Authorization: `Bearer ${tokenValue}` },
        });
        if (response.data && response.data.Member && response.data.Member.image) {
          setUserImage(response.data.Member.image);
        } else {
          setUserImage(null);
        }
      } catch (err) {
        setUserImage(null);
      }
    };
    fetchUserProfile();
  }, [token]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  const handleDashboardClick = () => {
    const usertype = localStorage.getItem("type");
    
    switch (usertype) {
      case "electioncoordinator":
        console.log("Navigating to ElectionCoPage");
        navigate("/ElectionCoPage");
        break;
      case "eventcoordinator":
        console.log("Navigating to EventCoPage");
        navigate("/EventCoPage");
        break;
      case "financecoordinator":
        console.log("Navigating to FinaceCoPage");
        navigate("/FinaceCoPage");
        break;
      case "communicationcoordinator":
        console.log("Navigating to CommuniCoPage");
        navigate("/CommuniCoPage");
        break;
      case "maintenancecoordinator":
        console.log("Navigating to MaintanCoPage");
        navigate("/MaintanCoPage");
        break;
      case "admin":
        console.log("Navigating to AdminPage");
        navigate("/AdminPage");
        break;
      default:
        console.log("Navigating to RUserProfile");
        navigate("/RUserProfile");
        break;
    }
  };

  return (
    <nav className="bg-gradient-to-r from-sky-950 to-indigo-900 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={logo} 
              alt="My Website Logo" 
              className="h-14 w-14 rounded-full border-2 border-blue-400 shadow-lg hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            COMMUNET
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? "text-blue-400 font-semibold bg-blue-900/30"
                  : "hover:text-blue-400 hover:bg-blue-900/20"
              }`
            }
          >
            HOME
          </NavLink>
          <NavLink 
            to="/AboutUs" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? "text-blue-400 font-semibold bg-blue-900/30"
                  : "hover:text-blue-400 hover:bg-blue-900/20"
              }`
            }
          >
            ABOUT US
          </NavLink>
          <NavLink 
            to="/ContactUs" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? "text-blue-400 font-semibold bg-blue-900/30"
                  : "hover:text-blue-400 hover:bg-blue-900/20"
              }`
            }
          >
            CONTACT US
          </NavLink>
          <NavLink 
            to="/community-rules" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive 
                  ? "text-blue-400 font-semibold bg-blue-900/30"
                  : "hover:text-blue-400 hover:bg-blue-900/20"
              }`
            }
          >
            RULES
          </NavLink>
          {token && (
            <>
              <NavLink 
                to="/Event" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "text-blue-400 font-semibold bg-blue-900/30"
                      : "hover:text-blue-400 hover:bg-blue-900/20"
                  }`
                }
              >
                EVENTS
              </NavLink>
              <NavLink 
                to="/Election" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? "text-blue-400 font-semibold bg-blue-900/30"
                      : "hover:text-blue-400 hover:bg-blue-900/20"
                  }`
                }
              >
                ELECTIONS
              </NavLink>
            </>
          )}
        </div>

        {/* Profile and Notification Icon */}
        <div className="flex items-center space-x-4">
          {token && (
            <button
              className="relative focus:outline-none"
              onClick={() => navigate('/notifications')}
              title="Notifications"
            >
              <FiBell className="w-6 h-6 text-white hover:text-blue-400 transition-colors duration-200" />
            </button>
          )}
          {token ? (
            <div className="flex items-center gap-3">
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                >
                  <img 
                    src={userImage || profile} 
                    alt="profile" 
                    className="h-12 w-12 rounded-full border-2 border-blue-400 shadow-lg hover:scale-105 transition-transform duration-300" 
                  />
                  <img 
                    src={menu} 
                    alt="menu" 
                    className="h-10 w-10 rounded-full hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                {isMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl transition-all duration-300 transform origin-top-right z-50">
                    <div className="p-4 space-y-3">
                      <button 
                        onClick={() => { setIsMenuOpen(false); navigate('/RUserProfile'); }} 
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        My Profile
                      </button>
                      <button 
                        onClick={() => { setIsMenuOpen(false); navigate('/MyEvents'); }} 
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        My Events
                      </button>
                      <button 
                        onClick={() => { setIsMenuOpen(false); navigate('/MyMaintance'); }} 
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        My Maintenance
                      </button>
                      {userType !== 'member' && (
                        <button 
                          onClick={() => { setIsMenuOpen(false); handleDashboardClick(); }} 
                          className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        >
                          Dashboard
                        </button>
                      )}
                      <div className="border-t border-gray-100 my-2"></div>
                      <button 
                        onClick={() => { setIsMenuOpen(false); handleLogout(); }} 
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button 
              onClick={() => navigate("/Register")} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
