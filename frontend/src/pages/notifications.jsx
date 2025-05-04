import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiBell, FiShield } from 'react-icons/fi';

const Notifications = () => {
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
              <div className="text-gray-600 text-center">
                You have no new notifications.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications; 