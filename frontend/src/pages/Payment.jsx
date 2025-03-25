import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan || {}; // Get selected plan from Checkout

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const handleChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/success", { state: { plan } }); // Navigate to success page with plan data
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Payment Details
        </h2>
        <p className="text-center mb-4">
          You are purchasing: <strong>{plan.id}</strong> for Rs.{plan.price}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nameOnCard"
            placeholder="Name on Card"
            className="w-full border p-2 rounded-md"
            value={paymentDetails.nameOnCard}
            onChange={(e) => {
              // Allow only letters and spaces (no numbers or special characters)
              const value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
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
              // Remove non-numeric characters, then format with dashes every 4 digits
              let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);

              // Insert dashes after every 4 digits
              value = value.replace(/(\d{4})(?=\d)/g, "$1-");

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

                if (value.length > 4) {
                  value = value.slice(0, 4); // Limit to 4 characters (MM/YY)
                }

                // Insert / after 2 digits (for MM/YY format)
                if (value.length > 2) {
                  value = value.slice(0, 2) + "/" + value.slice(2, 4);
                }

                // Check if month is greater than 12
                if (value.length >= 2) {
                  const month = parseInt(value.slice(0, 2));
                  if (month > 12) {
                    value = "12" + value.slice(2); // Freeze the month to 12 if greater than 12
                  }
                }

                // Update the state with the corrected value
                setPaymentDetails({
                  ...paymentDetails,
                  expiryDate: value,
                });
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

                // Ensure it's exactly 3 digits
                if (value.length > 3) {
                  value = value.slice(0, 3); // Limit to 3 digits
                }

                // Update the state with the new value
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
