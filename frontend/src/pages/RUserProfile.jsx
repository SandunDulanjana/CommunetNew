import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiUser, FiBell, FiShield, FiEdit2, FiSave } from 'react-icons/fi';
import Footer from '../componenets/Footer';

const RUserProfile = () => {
  const [userData, setUserData] = useState({
    houseNO: "",
    email: "",
    name: "",
    image: "",
    phoneNumber: "",
    bio: "",
    gender: "",
    NIC: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          console.error("No token found.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/ProfileRouter/displayMember", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUserData(response.data.Member || userData);
        } else {
          console.error("Failed to fetch user data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  const handleSave = async () => {
    const requiredFields = ["name", "houseNO", "email", "phoneNumber", "bio", "gender", "NIC"];

    for (let field of requiredFields) {
      if (!userData[field] || String(userData[field]).trim() === "") {
        setError(`${field} is required.`);
        return;
      }
    }

    if (isEdit && !userData.image) {
      setError("Profile image is required.");
      return;
    }

    setError("");

    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("houseNO", userData.houseNO);
      formData.append("email", userData.email);
      formData.append("phoneNumber", userData.phoneNumber);
      formData.append("bio", userData.bio);
      formData.append("gender", userData.gender);
      formData.append("NIC", userData.NIC);

      if (userData.image instanceof File) {
        formData.append("image", userData.image);
      }

      const response = await axios.put("http://localhost:5000/api/ProfileRouter/updateMember", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Profile updated successfully!");
        setUserData(response.data.updatedMember);
        setIsEdit(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile</h2>
              <nav className="space-y-1">
                <div className="flex items-center px-4 py-3 text-blue-600 bg-blue-50 rounded-xl">
                  <FiUser className="w-5 h-5 mr-3" />
                  <span>My Profile</span>
                </div>
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

          {/* Profile Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <button
                  onClick={() => (isEdit ? handleSave() : setIsEdit(true))}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-colors duration-200 font-medium"
                >
                  {isEdit ? (
                    <>
                      <FiSave className="w-5 h-5" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <FiEdit2 className="w-5 h-5" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-8">
                {/* Profile Image Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={
                            isEdit && userData.image instanceof File
                              ? URL.createObjectURL(userData.image)
                              : userData.image || "/default-avatar.png"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {isEdit && (
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                          <input
                            type="file"
                            onChange={(e) =>
                              setUserData((prev) => ({
                                ...prev,
                                image: e.target.files?.[0] || prev.image,
                              }))
                            }
                            className="hidden"
                          />
                          <FiEdit2 className="w-5 h-5" />
                        </label>
                      )}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                      <p className="text-gray-600">{userData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Name", field: "name" },
                    { label: "House Number", field: "houseNO" },
                    { label: "Phone Number", field: "phoneNumber" },
                    { label: "NIC", field: "NIC" },
                    { label: "Gender", field: "gender", type: "select", options: ["Male", "Female", "Other"] },
                    { label: "Bio", field: "bio" },
                  ].map(({ label, field, type, options }) => (
                    <div key={field} className="bg-gray-50 rounded-xl p-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                      </label>
                      {isEdit ? (
                        type === "select" ? (
                          <select
                            value={userData[field]}
                            onChange={(e) =>
                              setUserData((prev) => ({
                                ...prev,
                                [field]: e.target.value,
                              }))
                            }
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select {label}</option>
                            {options.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={userData[field]}
                            onChange={(e) =>
                              setUserData((prev) => ({
                                ...prev,
                                [field]: e.target.value,
                              }))
                            }
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        )
                      ) : (
                        <p className="text-gray-900">{userData[field] || `No ${label.toLowerCase()} provided`}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RUserProfile;
