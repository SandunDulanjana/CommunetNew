import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import profile from "../assets/profile.jpg";
import menu from "../assets/menuicon.png";
import axios from "axios";
import { FiBell } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { token, logout } = useAuth();
  const [userImage, setUserImage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userType = user?.memberType;

  useEffect(() => {
    const fetchImage = async () => {
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5000/api/ProfileRouter/displayMember", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserImage(res?.data?.Member?.image || null);
      } catch (error) {
        setUserImage(null);
      }
    };

    fetchImage();
  }, [token]);

  // ✅ Updated to use memberType from localStorage user
  const handleDashboardClick = () => {
    const type = userType?.toLowerCase();
    switch (type) {
      case "electioncoordinator":
        navigate("/ElectionCoPage");
        break;
      case "eventcoordinator":
        navigate("/EventCoPage");
        break;
      case "financecoordinator":
        navigate("/FinaceCoPage");
        break;
      case "communicationcoordinator":
        navigate("/CommuniCoPage");
        break;
      case "maintenancecoordinator":
        navigate("/MaintanCoPage");
        break;
      case "admin":
        navigate("/AdminPage");
        break;
      default:
        navigate("/RUserProfile");
        break;
    }
  };

  return (
    <nav className="bg-gradient-to-r from-sky-950 to-indigo-900 py-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="h-14 w-14 rounded-full border-2 border-blue-400 shadow-lg" />
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            COMMUNET
          </h1>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-white ${isActive ? "font-semibold bg-blue-900/30" : "hover:text-blue-400 hover:bg-blue-900/20"}`
          }>HOME</NavLink>
          <NavLink to="/AboutUs" className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-white ${isActive ? "font-semibold bg-blue-900/30" : "hover:text-blue-400 hover:bg-blue-900/20"}`
          }>ABOUT US</NavLink>
          <NavLink to="/ContactUs" className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-white ${isActive ? "font-semibold bg-blue-900/30" : "hover:text-blue-400 hover:bg-blue-900/20"}`
          }>CONTACT US</NavLink>
          <NavLink to="/community-rules" className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-white ${isActive ? "font-semibold bg-blue-900/30" : "hover:text-blue-400 hover:bg-blue-900/20"}`
          }>RULES</NavLink>

          {token && (
            <>
              <NavLink to="/Event" className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-white ${isActive ? "font-semibold bg-blue-900/30" : "hover:text-blue-400 hover:bg-blue-900/20"}`
              }>EVENTS</NavLink>
              <NavLink to="/Election" className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-white ${isActive ? "font-semibold bg-blue-900/30" : "hover:text-blue-400 hover:bg-blue-900/20"}`
              }>ELECTIONS</NavLink>
            </>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {token && (
            <button onClick={() => navigate("/notifications")} title="Notifications" className="text-white hover:text-blue-400 transition">
              <FiBell size={22} />
            </button>
          )}

          {token ? (
            <div className="relative" ref={dropdownRef}>
              <div onClick={() => setIsMenuOpen((prev) => !prev)} className="flex items-center gap-2 cursor-pointer">
                <img src={userImage || profile} alt="Profile" className="h-11 w-11 rounded-full border-2 border-blue-400 shadow-md" />
                <img src={menu} alt="menu" className="h-8 w-8" />
              </div>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-50">
                  <div className="py-3 px-4">
                    <button onClick={() => { navigate("/RUserProfile"); setIsMenuOpen(false); }}
                      className="w-full text-left py-2 px-3 rounded hover:bg-blue-50"
                    >My Profile</button>
                    <button onClick={() => { navigate("/MyEvents"); setIsMenuOpen(false); }}
                      className="w-full text-left py-2 px-3 rounded hover:bg-blue-50"
                    >My Events</button>
                    <button onClick={() => { navigate("/MyMaintance"); setIsMenuOpen(false); }}
                      className="w-full text-left py-2 px-3 rounded hover:bg-blue-50"
                    >My Maintenance</button>
                    <button onClick={() => { navigate("/MyPayments"); setIsMenuOpen(false); }}
                      className="w-full text-left py-2 px-3 rounded hover:bg-blue-50"
                    >My Payments</button>

                    <button onClick={() => { handleDashboardClick(); setIsMenuOpen(false); }}
                      className="w-full text-left py-2 px-3 rounded hover:bg-blue-50"
                    >Dashboard</button>

                    <div className="border-t my-2"></div>
                    <button onClick={() => { logout(); navigate("/LogIn"); }}
                      className="w-full text-left py-2 px-3 text-red-600 rounded hover:bg-red-50"
                    >Logout</button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/Register")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow transition"
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
