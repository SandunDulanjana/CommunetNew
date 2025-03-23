import React, { useState } from "react";
import apartmentImage from "../assets/aprtmentL.jpg"

const LogIn = () => {

  return (
    <div
  className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat rounded-xl"
  style={{ backgroundImage: `url(${apartmentImage})` }}>



      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-sky-950">Login</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sky-950 text-sm mb-2">Email</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-lg bg-slate-400 border border-slate-400 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sky-950 text-sm mb-2">Password</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-lg bg-slate-400 border border-slate-400 text-gray-900 placeholder-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
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
      </div>
    </div>
  );
};

export default LogIn;
