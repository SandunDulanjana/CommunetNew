import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiBell, FiShield } from 'react-icons/fi';
import axios from 'axios';

const Notifications = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view notifications');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:5000/api/announcement/audience-announcements', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      const data = res.data;
      if (data.success) {
        setAnnouncements(data.announcements);
        setError('');
      } else {
        setError(data.message || 'Failed to load notifications.');
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error('Error fetching notifications:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to load notifications. Please try again later.');
      setLoading(false);
    });
  }, []);

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
                <div className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-xl">
                  <FiBell className="w-5 h-5 mr-3" />
                  <span>Notifications</span>
                </div>
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
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
              {loading ? (
                <div className="text-gray-600 text-center">Loading...</div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : announcements.length === 0 ? (
                <div className="text-gray-600 text-center">You have no new notifications.</div>
              ) : (
                <ul className="space-y-4">
                  {announcements.map(a => (
                    <li key={a._id} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <div className="font-semibold text-blue-700">{a.Type}</div>
                      <div className="text-gray-700">{a.discription}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(a.date).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 