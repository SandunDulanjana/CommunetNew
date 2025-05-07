import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaHome, FaUserCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, userDetails } = location.state || {};
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updatePaymentStatus = async () => {
      if (!userDetails?.email || !plan) {
        setError("Missing payment information. Please try again.");
        setLoading(false);
        return;
      }

      try {
        // First, save the payment details
        await axios.post("http://localhost:5000/api/payments/save", {
          name: userDetails.name,
          email: userDetails.email,
          planId: plan.id,
          amount: plan.price,
          date: new Date(),
        });

        // Then update the payment status
        await axios.post("http://localhost:5000/api/payments/update-status", {
          email: userDetails.email,
          status: "Paid",
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error processing payment:", error);
        setError(
          error.response?.data?.message || 
          "Failed to process payment. Please contact support."
        );
        setLoading(false);
      }
    };

    updatePaymentStatus();
  }, [userDetails, plan]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-950 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-sky-950 text-white px-6 py-3 rounded-lg hover:bg-sky-900 transition-colors"
            >
              Return to Home
            </button>
            <button
              onClick={() => navigate("/buy")}
              className="bg-white text-sky-950 border-2 border-sky-950 px-6 py-3 rounded-lg hover:bg-sky-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <FaCheckCircle className="text-green-500 text-7xl" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Registration & Payment Successful!
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 mb-8"
          >
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <FaUserCheck />
              <p>Your account has been created successfully</p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <FaCheckCircle />
              <p>Payment has been processed successfully</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-sky-50 p-4 rounded-lg mb-8"
          >
            <p className="text-sky-950">
              Welcome to our community! Your account is now fully set up and ready to use.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 bg-sky-950 text-white px-6 py-3 rounded-lg hover:bg-sky-900 transition-colors"
            >
              <FaHome />
              Go to Home
            </button>
            <button
              onClick={() => navigate("/LogIn")}
              className="flex items-center justify-center gap-2 bg-white text-sky-950 border-2 border-sky-950 px-6 py-3 rounded-lg hover:bg-sky-50 transition-colors"
            >
              <FaUserCheck />
              Go to Login
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;
