import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <ul className="space-y-2 text-sm">
          <li className="text-blue-600 font-semibold">My Profile</li>
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
          <li>
            <Link to="/settings" className="hover:text-blue-600">
              Settings
            </Link>
          </li>
        </ul>
      </div>

      {/* Profile Content */}
      <div className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Profile</h2>
            <button
              onClick={() => (isEdit ? handleSave() : setIsEdit(true))}
              className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition"
            >
              {isEdit ? "Save" : "Edit"}
            </button>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border">
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
              <input
                type="file"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    image: e.target.files?.[0] || prev.image,
                  }))
                }
                className="block text-sm text-gray-500"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {["name", "houseNO", "email", "phoneNumber", "bio", "NIC"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-1 capitalize">{field}</label>
                {isEdit ? (
                  <input
                    type="text"
                    value={userData[field]}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        [field]: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded-lg bg-gray-100"
                  />
                ) : (
                  <p className="text-gray-700">{userData[field] || `No ${field} provided`}</p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                  className="w-full p-2 border rounded-lg bg-gray-100"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-gray-700">{userData.gender || "No gender provided"}</p>
              )}
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
