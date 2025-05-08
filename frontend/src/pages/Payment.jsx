import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || {}; // Get selected plan from Checkout
  const userDetails = location.state?.userDetails || { name: "Guest", email: "Not provided" }; // Get userDetails from Checkout

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const handleChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save payment details to the backend
      await axios.post("http://localhost:5000/api/payments/save", {
        name: userDetails.name,
        email: userDetails.email,
        planId: plan.id,
        amount: plan.price,
        date: new Date(),
      });

      // Navigate to the success page
      navigate("/success", { state: { plan, userDetails } });
    } catch (error) {
      console.error("Error saving payment details:", error);
      alert("Failed to save payment details. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Payment Details
        </h2>
        <p className="text-center mb-4">
          You are purchasing: <strong>{plan.id} for Rs.{plan.price}</strong>
        </p>
        <p className="text-center mb-4">
          Name: <strong>{userDetails.name}</strong>
        </p>
        <p className="text-center mb-4">
          Email: <strong>{userDetails.email}</strong>
        </p>
        <p className="text-center mb-4">
          Name: <strong>{userDetails.name}</strong>
        </p>
        <p className="text-center mb-4">
          Email: <strong>{userDetails.email}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nameOnCard"
            placeholder="Name on Card"
            className="w-full border p-2 rounded-md"
            value={paymentDetails.nameOnCard}
            onChange={(e) => {
              const value = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // Allow only letters and spaces
              setPaymentDetails({
                ...paymentDetails,
                nameOnCard: value,
              });
            }}
            required
          />

          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            className="w-full border p-2 rounded-md"
            value={paymentDetails.cardNumber}
            onChange={(e) => {
              let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16); // Allow only numbers
              value = value.replace(/(\d{4})(?=\d)/g, "$1-"); // Format with dashes
              setPaymentDetails({
                ...paymentDetails,
                cardNumber: value,
              });
            }}
            required
          />

          <div className="flex space-x-4">
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              className="w-1/2 border p-2 rounded-md"
              value={paymentDetails.expiryDate}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                if (value.length > 4) value = value.slice(0, 4); // Limit to 4 characters
                if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2); // Format as MM/YY

                // Allow a single '0' as the first digit but validate months (01 to 12)
                const month = parseInt(value.slice(0, 2), 10);
                if (value.length >= 2 && (month > 12 || month < 1)) {
                  return; // Ignore invalid months
                }

                setPaymentDetails({
                  ...paymentDetails,
                  expiryDate: value,
                });
              }}
              onBlur={(e) => {
                const value = e.target.value;
                const regex = /^(0[1-9]|1[0-2])\/\d{2}$/; // Validate MM/YY format
                if (!regex.test(value)) {
                  alert("Invalid expiry date format. Please use MM/YY.");
                  setPaymentDetails({ ...paymentDetails, expiryDate: "" });
                  return;
                }

                const [month, year] = value.split("/").map(Number);
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
                const currentYear = currentDate.getFullYear() % 100; // Get last two digits of the year

                if (year < currentYear || (year === currentYear && month < currentMonth)) {
                  alert("Expiry date cannot be in the past.");
                  setPaymentDetails({ ...paymentDetails, expiryDate: "" });
                }
              }}
              required
            />

            <input
              type="text"
              name="cvv"
              placeholder="CVV"
              className="w-1/2 border p-2 rounded-md"
              value={paymentDetails.cvv}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
                if (value.length > 3) value = value.slice(0, 3); // Limit to 3 digits
                setPaymentDetails({
                  ...paymentDetails,
                  cvv: value,
                });
              }}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-md"
          >
            Pay Now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
