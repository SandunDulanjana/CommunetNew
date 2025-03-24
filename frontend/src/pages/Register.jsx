import {useState} from "react";
import axios from "axios";
import { NavLink } from "react-router-dom"; // Import NavLink
import apartmentImage from "../assets/aprtmentL.jpg";

const Register = () => {

    const [houseNO, sethouseNo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    
    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name === "houseNo") sethouseNo(value);
      if (name === "email") setEmail(value);
      if (name === "password") setPassword(value);
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:5000/api/user/register", {
          houseNO,
          email,
          password,
        });
        setMessage(response.data.message);
      } catch (error) {
        console.error("Registration Error:", error.response?.data || error.message);
        setMessage(error.response?.data?.message || "Error registering user");
      }      
    };
  
    
  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat rounded-xl"
      style={{ backgroundImage: `url(${apartmentImage})` }}>

      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-sky-950">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sky-950 text-sm mb-2">HouseNO</label>
            <input
              type="text"
              name="houseNo"
              className="w-full p-3 rounded-lg bg-slate-400 border border-slate-400 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your HouseNO"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sky-950 text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
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
            Register
          </button>
        </form>
        <NavLink to="/LogIn">
          <p className="text-gray-400 text-sm text-center mt-4">
            Already have an account? <span className="text-blue-400 hover:underline">Login</span>
          </p>
        </NavLink>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Register;
