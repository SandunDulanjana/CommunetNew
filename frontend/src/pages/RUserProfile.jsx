import React, { useState, useEffect } from "react";
import Footer from "../componenets/Footer";
import axios from "axios";

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
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) {
          console.error("No user ID found.");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/member/displayMember/${userId}`);
        setUserData(response.data.Member);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/member/updateMember/${userId}`, userData);
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="bg-white text-black">
      <div className="max-w-4xl mx-auto p-6 bg-white text-black rounded-lg shadow-lg mt-8 ">
        <div className="flex justify-center">
          <img
            src={userData.image || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAA..."} 
            alt="User"
            className="rounded-full border-4 border-sky-600"
            width="100"
            height="100"
          />
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">User Profile</h2>
            <button
              onClick={() => (isEdit ? handleSave() : setIsEdit(true))}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-950 transition"
            >
              {isEdit ? "Save" : "Edit"}
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex flex-col">
              <label className="font-medium">Name:</label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
                  className="p-2 bg-gray-300 text-black rounded-lg border border-gray-600"
                />
              ) : (
                <p>{userData.name || "No Name Provided"}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Gender:</label>
              {isEdit ? (
                <select
                  value={userData.gender}
                  onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                  className="p-2 bg-gray-300 text-black rounded-lg border border-gray-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p>{userData.gender || "No Gender Provided"}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Bio:</label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.bio}
                  onChange={(e) => setUserData((prev) => ({ ...prev, bio: e.target.value }))}
                  className="p-2 bg-gray-300 text-black rounded-lg border border-gray-600"
                />
              ) : (
                <p>{userData.bio || "No Bio Provided"}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-medium">House No:</label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.houseNO}
                  onChange={(e) => setUserData((prev) => ({ ...prev, houseNO: e.target.value }))}
                  className="p-2 bg-gray-300 text-black rounded-lg border border-gray-600"
                />
              ) : (
                <p>{userData.houseNO || "No House Number Provided"}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-medium">NIC:</label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.NIC}
                  onChange={(e) => setUserData((prev) => ({ ...prev, NIC: e.target.value }))}
                  className="p-2 bg-gray-300 text-black rounded-lg border border-gray-600"
                />
              ) : (
                <p>{userData.NIC || "No NIC Provided"}</p>
              )}
            </div>

            <hr className="my-6 border-gray-600" />

            <p className="text-xl font-semibold">CONTACT INFORMATION</p>

            <div className="flex flex-col">
              <label className="font-medium">Phone Number:</label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.phoneNumber}
                  onChange={(e) => setUserData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  className="p-2 bg-gray-300 text-black rounded-lg border border-gray-600"
                />
              ) : (
                <p>{userData.phoneNumber || "No Phone Number Provided"}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="font-medium">Email:</label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.email}
                  onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                  className="p-2 bg-gray-300 text-black rounded-lg border border-gray-600"
                />
              ) : (
                <p>{userData.email || "No Email Provided"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RUserProfile;
