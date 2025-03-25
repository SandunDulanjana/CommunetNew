import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || {};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
        <p className="mt-4">You have successfully purchased the <strong>{plan.id}</strong> plan.</p>
        <p className="text-gray-600">Thank you for your purchase.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-gray-800 text-white px-6 py-2 rounded-md"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Success;
