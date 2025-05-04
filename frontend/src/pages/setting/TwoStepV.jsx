import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaLock } from 'react-icons/fa';
import { FiUser, FiBell, FiShield } from 'react-icons/fi';

const TwoStepV = () => {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+94');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const countryCodes = [
    { code: '+94', country: 'Sri Lanka' },
    { code: '+91', country: 'India' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+977', country: 'Nepal' },
    { code: '+95', country: 'Myanmar' },
    { code: '+66', country: 'Thailand' },
    { code: '+60', country: 'Malaysia' },
    { code: '+65', country: 'Singapore' },
    { code: '+62', country: 'Indonesia' },
    { code: '+63', country: 'Philippines' },
  ];

  const handleSendOTP = async () => {
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const fullPhoneNumber = `${countryCode}${phone}`;
      const response = await fetch('http://localhost:5000/api/ProfileRouter/send-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone: fullPhoneNumber }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setMessage(`✅ OTP sent successfully. Your OTP is: ${data.otp}`);
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
      const token = localStorage.getItem('token');
      const fullPhoneNumber = `${countryCode}${phone}`;
      const response = await fetch('http://localhost:5000/api/ProfileRouter/verify-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone: fullPhoneNumber, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage('✅ Two-factor authentication enabled successfully.');
        setTimeout(() => {
          navigate('/settings');
        }, 2000);
      } else {
        setMessage(`❌ ${data.message || 'Invalid OTP'}`);
      }
    } catch (err) {
      setMessage('❌ Server error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile</h2>
              <nav className="space-y-1">
                <Link to="/RUserProfile" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200">
                  <FiUser className="w-5 h-5 mr-3" />
                  <span>My Profile</span>
                </Link>
                <Link to="/notifications" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200">
                  <FiBell className="w-5 h-5 mr-3" />
                  <span>Notifications</span>
                </Link>
                <Link to="/settings" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200">
                  <FiShield className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Two-Step Verification</h1>
              {!otpSent ? (
                <>
                  <label className="block text-gray-700 text-sm mb-1">Phone Number</label>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="appearance-none bg-white border rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.code} ({country.country})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center border rounded-md p-2">
                      <FaPhoneAlt className="text-gray-400 mr-2" />
                      <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full outline-none"
                        pattern="[0-9]*"
                        title="Please enter numbers only"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Enter your phone number without the country code
                  </p>
                  <button
                    onClick={handleSendOTP}
                    disabled={loading || !phone}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 mt-4"
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
      </div>
    </div>
  );
};

export default TwoStepV;
