import React, { useState } from "react";
import apartmentImage from "../assets/aprtmentL.jpg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext"; // ✅ Import Auth Context

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ Use login from AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/user/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Create user object from response
        const user = {
          token: response.data.token,
          memberType: response.data.memberType,
          email: response.data.email,
          id: response.data.id,
          name: response.data.name,
        };

        login(user); // ✅ Set user in context and localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", user.token); // <-- Add this line!

        // Redirect based on memberType
        switch (response.data.memberType) {
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
      } else {
        alert("Invalid credentials. Please check your email and password.");
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
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-6">Sign In to Your Account</h2>
        {message && (
          <div className="mb-4 text-center text-red-600 font-medium">{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-900 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-blue-900 text-sm font-semibold mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                className="w-full p-3 pr-10 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-700 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition shadow-lg"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between items-center mt-6">
          <a href="/forgotPassword" className="text-blue-500 hover:underline text-sm">Forgot password?</a>
          <button
            onClick={() => navigate('/Register')}
            className="text-blue-700 hover:underline text-sm font-semibold"
          >
            Don't have an account? Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
