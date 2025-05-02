import React from "react";
import { Link } from "react-router-dom";

const Settings = () => {
  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
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
          <li>
            <Link to="/notifications" className="hover:text-blue-600">
              Notifications
            </Link>
          </li>
          <li className="text-blue-600 font-semibold">
            Settings
          </li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl mt-10">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Settings</h1>
          <div className="text-gray-600 text-center">
            Settings options will be available here soon.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 