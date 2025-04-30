import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaLock } from 'react-icons/fa';

const TwoStepV = () => {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/ProfileRouter/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setMessage('✅ OTP sent successfully.');
      } else {
        setMessage(`❌ ${data.message || 'Failed to send OTP'}`);
      }
    } catch (err) {
      setMessage('❌ Server error');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/ProfileRouter/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ OTP verified successfully. Access granted.');
      } else {
        setMessage(`❌ ${data.message || 'Invalid OTP'}`);
      }
    } catch (err) {
      setMessage('❌ Server error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <ul className="space-y-2 text-sm">
          <li>
          <Link to="/RUserProfile" className="hover:text-blue-600">
                My Profile
            </Link>
            </li>
          <li>
            <Link to="/UpdatePassword" className="hover:text-blue-600">
              Change Password
            </Link>
          </li>
          <li className="text-blue-600 font-semibold">
            <Link to="/TwoStepV" className="hover:text-blue-600">
              Set Two-Step Verification
            </Link>
          </li>
          <li>
            <Link to="/delete-account" className="hover:text-red-600">
              Delete Account
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center text-indigo-700">Two-Step Verification</h2>
          <p className="text-center text-gray-600 text-sm">
            Secure your account by verifying your phone number with a one-time passcode (OTP).
          </p>

          {!otpSent ? (
            <>
              <label className="block text-gray-700 text-sm mb-1">Phone Number</label>
              <div className="flex items-center border rounded-md p-2">
                <FaPhoneAlt className="text-gray-400 mr-2" />
                <input
                  type="tel"
                  placeholder="e.g. +94771234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
              <button
                onClick={handleSendOTP}
                disabled={loading || !phone}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </>
          ) : (
            <>
              <label className="block text-gray-700 text-sm mb-1">Enter OTP</label>
              <div className="flex items-center border rounded-md p-2">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full outline-none"
                />
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || !otp}
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </>
          )}

          {message && (
            <p className={`text-sm text-center ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TwoStepV;
