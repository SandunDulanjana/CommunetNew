import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan, email } = location.state || {}; // Get selected plan and email from navigation state

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: email || "", // Initialize with email from navigation state
    phone: "",
  });

  // Update email if it changes in navigation state
  useEffect(() => {
    if (email) {
      setUserDetails(prev => ({ ...prev, email }));
    }
  }, [email]);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    if (userDetails.name && userDetails.email && userDetails.phone) {
      navigate("/payment", {
        state: { plan, userDetails },
      });
    } else {
      alert("Please fill in all the details.");
    }
  };

  const handleDustReport = () => {
    navigate("/dust-report", {
      state: { name: userDetails.name, email: userDetails.email },
    });
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
          <p className="text-sky-950">{plan.desc}</p>
          <p className="text-xl font-bold mt-2">Rs.{plan.price} / per person</p>
        </div>

        <form className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userDetails.name}
            onChange={handleChange}
            onKeyPress={(e) => {
              const regex = /^[a-zA-Z\s]*$/; // Allow only letters and spaces
              if (!regex.test(e.key)) {
                e.preventDefault(); // Prevent invalid characters
              }
            }}
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
              const value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
              if (value.length <= 10) {
                setUserDetails({ ...userDetails, phone: value });
              }
            }}
            onBlur={(e) => {
              const regex = /^(071|076|074|077|078|075|072)[0-9]{7}$/; // Validate prefix and length
              if (!regex.test(e.target.value)) {
                alert("Phone number must start with 071, 076, 074, 077, 078, 075, or 072 and be exactly 10 digits.");
                setUserDetails({ ...userDetails, phone: '' }); // Clear invalid input
              }
            }}
            className="w-full border px-4 py-2 rounded-md"
            required
          />

          <button
            type="button"
            onClick={handlePayment}
            className="w-full bg-sky-950 text-white py-2 rounded-md mt-4"
          >
            Proceed to Payment
          </button>

          
        </form>
      </div>
    </div>
  );
};

export default Checkout;
