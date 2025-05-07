import React from "react";
import { plans } from "../assets/assets";
import { assets } from "../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";

const BuyPlans = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  if (!plans || plans.length === 0) {
    return <p className="text-center text-gray-600 mt-10">No plans available.</p>;
  }

  const handleCheckout = (plan) => {
    navigate("/checkout", { state: { plan, email } });
  };

  return (
    <div className="min-h-[80vh] text-center pt-14 mb-10">
      <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our Plans
      </button>
      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Choose the plan
      </h1>
      <div className="flex flex-wrap justify-center gap-6 text-left">
        {plans.map((item) => (
          <div
            key={item.id}
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-sky-950 hover:scale-105 transition-all duration-500 cursor-pointer"
          >
            <img
              src={assets.logo_icon}
              alt="Plan Logo"
              className="w-16 h-16 mx-auto"
            />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">
                Rs.{item.price} per person
              </span>
            </p>
            <button
              onClick={() => handleCheckout(item)}
              className="w-full bg-sky-950 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyPlans;
