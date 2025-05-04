import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiBell, FiShield } from 'react-icons/fi';

const UpdateEmail = () => {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to update your email');
        setLoading(false);
        return;
      }

      const res = await axios.put('http://localhost:5000/api/ProfileRouter/update-email', 
        {
          currentEmail,
          newEmail
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.success) {
        setMessage('Email updated successfully');
        setCurrentEmail('');
        setNewEmail('');
        setTimeout(() => {
          navigate('/settings');
        }, 2000);
      } else {
        setMessage(res.data.message || 'Failed to update email');
      }
    } catch (err) {
      console.error('Email update error:', err);
      setMessage(err.response?.data?.message || 'Failed to update email');
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
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
              <nav className="space-y-1">
                <Link to="/RUserProfile" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200">
                  <FiUser className="w-5 h-5 mr-3" />
                  <span>My Profile</span>
                </Link>
                <Link to="/notifications" className="flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200">
                  <FiBell className="w-5 h-5 mr-3" />
                  <span>Notifications</span>
                </Link>
                <div className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-xl">
                  <FiShield className="w-5 h-5 mr-3" />
                  <span>Settings</span>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Change Email</h1>
              {message && (
                <div className={`mb-4 p-4 rounded ${
                  message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Email
                  </label>
                  <input
                    type="email"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400"
                >
                  {loading ? 'Updating...' : 'Update Email'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmail;