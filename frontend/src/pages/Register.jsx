import {useState} from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import apartmentImage from "../assets/aprtmentL.jpg";

const Register = () => {
  const [houseNO, sethouseNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [houseNoError, setHouseNoError] = useState("");
  const navigate = useNavigate();

  const validateHouseNumber = (value) => {
    const pattern = /^[A-D][1-3]0[1-4]$/;
    if (!pattern.test(value)) {
      setHouseNoError("House number must follow the pattern: [A-D][1-3]0[1-4] (e.g., A103, B204)");
      return false;
    }
    setHouseNoError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "houseNo") {
      sethouseNo(value.toUpperCase());
      validateHouseNumber(value.toUpperCase());
    }
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate house number before submission
    if (!validateHouseNumber(houseNO)) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/user/register", {
        houseNO,
        email,
        password,
      });
      setMessage(response.data.message);
      if (response.data.success) {
        setTimeout(() => {
          navigate('/buy', { state: { email } });
        }, 1200);
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      if (error.message === "Network Error") {
        setMessage("Network error. Please check your connection and try again.");
      } else {
        setMessage(error.response?.data?.message || "Error registering user");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat rounded-xl" style={{ backgroundImage: `url(${apartmentImage})` }}>
      <div className="bg-white/90 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-6">Create Your Account</h2>
        {message && (
          <div className={`mb-4 text-center font-medium ${message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-900 text-sm font-semibold mb-2">House Number</label>
            <input
              type="text"
              name="houseNo"
              value={houseNO}
              className={`w-full p-3 rounded-lg bg-gray-100 border ${
                houseNoError ? 'border-red-500' : 'border-gray-300'
              } text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              placeholder="Enter your House Number (e.g., A103)"
              onChange={handleChange}
              required
              maxLength={4}
            />
            {houseNoError && (
              <p className="mt-1 text-sm text-red-600">{houseNoError}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Format: [A-D][1-3]0[1-4] (e.g., A103, B204, C302, D104)
            </p>
          </div>
          <div>
            <label className="block text-blue-900 text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
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
            Register
          </button>
        </form>
        <div className="flex justify-center items-center mt-6">
          <button
            onClick={() => navigate('/LogIn')}
            className="text-blue-700 hover:underline text-sm font-semibold"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
