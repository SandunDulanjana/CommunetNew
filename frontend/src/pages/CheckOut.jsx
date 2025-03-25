import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan; // Get selected plan from navigation state

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (userDetails.name && userDetails.email && userDetails.phone) {
      navigate("/payment", {
        state: { plan, userDetails }, // Passing plan and userDetails to payment page
      });
    } else {
      alert("Please fill in all the details.");
    }
  };

  if (!plan) {
    return <p className="text-center text-gray-600 mt-10">No plan selected.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-semibold">{plan.id}</h3>
          <p className="text-gray-600">{plan.desc}</p>
          <p className="text-xl font-bold mt-2">Rs.{plan.price} / per person</p>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userDetails.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={(e) => {
              const inputValue = e.target.value;

              // Allow only alphanumeric characters and the '@' symbol
              const validValue = inputValue.replace(/[^a-zA-Z0-9@.]/g, "");

              // Ensure '@' is not the first character
              if (validValue[0] !== "@") {
                setUserDetails({
                  ...userDetails,
                  email: validValue,
                });
              }
            }}
            className="w-full border px-4 py-2 rounded-md"
            required
          />

<input
  type="tel"
  name="phone"
  placeholder="Phone Number"
  value={userDetails.phone}
  onChange={(e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10); // Allow only numbers and limit to 10 digits
    if (value.length <= 10) {
      setUserDetails({
        ...userDetails,
        phone: value,
      });
    }
  }}
  className="w-full border px-4 py-2 rounded-md"
  required
/>


          <button
            type="button"
            onClick={handlePayment}
            className="w-full bg-gray-800 text-white py-2 rounded-md mt-4"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
