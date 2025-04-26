import React, { useState } from "react";
import apartmentImage from "../assets/aprtmentL.jpg";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
 

const LogIn = () => {
  const [email, setEmail] = useState(""); // Always initialize with empty string
  const [password, setPassword] = useState(""); // Always initialize with empty string
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // For navigating after login

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", { email, password });
      
      const response = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });
  
      console.log("Login response:", response.data);
  
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("userId", response.data.id);
        window.dispatchEvent(new Event("storage"));
  
        // Let's check what ID we're getting
        console.log("User ID from response:", response.data.id);
        
        // Add a default role check
        const userRole = response.data.role || 'user'; // Get role from response or default to 'user'
        console.log("User role:", userRole);

        // Store the role in localStorage
        localStorage.setItem("userRole", userRole);

        // Navigate based on role instead of hardcoded IDs
        switch (userRole) {
          case "election":
            console.log("Navigating to ElectionCoPage");
            navigate("/ElectionCoPage");
            break;
          case "event":
            console.log("Navigating to EventCoPage");
            navigate("/EventCoPage");
            break;
          case "finance":
            console.log("Navigating to FinaceCoPage");
            navigate("/FinaceCoPage");
            break;
          case "communication":
            console.log("Navigating to CommuniCoPage");
            navigate("/CommuniCoPage");
            break;
          case "maintenance":
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
      } else {
        console.log("Login failed:", response.data.message);
        setMessage(response.data.message);
      }
  
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(error?.response?.data?.message || "Error logging in");
    }
  };
  
  
  

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat rounded-xl"
      style={{ backgroundImage: `url(${apartmentImage})` }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-sky-950">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sky-950 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}  // Always controlled by state
              className="w-full p-3 rounded-lg bg-slate-400 border border-slate-400 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sky-950 text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password} // Always controlled by state
              className="w-full p-3 rounded-lg bg-slate-400 border border-slate-400 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-sm text-center mt-4">
          <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
        </p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LogIn;
