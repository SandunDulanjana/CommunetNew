import React from "react";
import { Link } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiTrash2, FiUser, FiBell } from 'react-icons/fi';

const Settings = () => {
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
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Account Settings</h1>
              
              <div className="space-y-8">
                {/* Email Section */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiMail className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h2 className="text-lg font-semibold text-gray-900">Email Address</h2>
                      <p className="mt-1 text-gray-600">Update your email address for account notifications and communications.</p>
                      <Link to="/UpdateEmail">
                      <button className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                        Change Email
                      </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Password Section */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiLock className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h2 className="text-lg font-semibold text-gray-900">Password</h2>
                      <p className="mt-1 text-gray-600">Update your password to keep your account secure.</p>
                      <Link to="/UpdatePassword">
                        <button className="mt-4 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                          Change Password
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Two-Factor Authentication Section */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FiShield className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h2 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h2>
                      <p className="mt-1 text-gray-600">Add an extra layer of security to your account.</p>
                      <div className="mt-4 space-x-4">
                      <Link to="/TwoStepV">
                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                          Setup SMS 2FA
                        </button>
                        </Link>
                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                          Setup Authenticator App
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delete Account Section */}
                <div className="bg-red-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <FiTrash2 className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h2 className="text-lg font-semibold text-red-600">Delete Account</h2>
                      <p className="mt-1 text-gray-600">Permanently delete your account and all associated data.</p>
                      <button className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;