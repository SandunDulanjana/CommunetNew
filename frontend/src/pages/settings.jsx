import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiShield, FiTrash2, FiUser, FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const Settings = () => {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/ProfileRouter/verify-delete',
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setIsConfirmModalOpen(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify password');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        'http://localhost:5000/api/ProfileRouter/delete',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { password }
        }
      );

      if (response.data.success) {
        localStorage.removeItem('token');
        localStorage.removeItem('type');
        toast.success('Account deleted successfully');
        navigate('/Login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account');
    } finally {
      setIsLoading(false);
      setIsConfirmModalOpen(false);
    }
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
                      <button 
                        onClick={handleDeleteClick}
                        className="mt-4 bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                      >
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

      {/* Password Verification Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Your Password</h3>
            <p className="text-gray-600 mb-4">Please enter your password to confirm account deletion.</p>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your password"
                required
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Confirm Account Deletion</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;