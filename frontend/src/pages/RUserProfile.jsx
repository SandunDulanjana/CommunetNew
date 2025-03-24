import { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../componenets/Footer';

const RUserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Get logged-in user's ID

    if (userId) {
      axios.get(`http://localhost:5000/api/member/displayMember/${userId}`)
        .then((response) => {
          setUserData(response.data); // Set user data from API
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  if (!userData) return <p className="text-center mt-10">Loading user profile...</p>;

  return (
    <div>
      <div className="max-w-lg mx-auto bg-white text-black p-6 rounded-lg shadow-lg mt-16">
        <img 
          className="w-24 h-24 rounded-full mx-auto border-4 border-cyan-400" 
          src={userData.image || "/default-profile.png"} 
          alt="Profile" 
        />
        <div className="text-center mt-4">
          {isEdit ? (
            <input
              className="w-full p-2 bg-white rounded-md border border-cyan-400"
              type="text"
              value={userData.name}
              onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <p className="text-xl font-semibold">{userData.name}</p>
          )}
        </div>

        <div className="text-center mt-4">
          {isEdit ? (
            <input
              className="w-full p-2 bg-white rounded-md border border-cyan-400"
              type="text"
              value={userData.email}
              onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <p className="text-xl font-semibold">{userData.email}</p>
          )}
        </div>


        <div className="text-center mt-4">
          {isEdit ? (
            <input
              className="w-full p-2 bg-white rounded-md border border-cyan-400"
              type="text"
              value={userData.name}
              onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <p className="text-xl font-semibold">{userData.name}</p>
          )}
        </div>


        <div className="text-center mt-4">
          {isEdit ? (
            <input
              className="w-full p-2 bg-white rounded-md border border-cyan-400"
              type="text"
              value={userData.name}
              onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <p className="text-xl font-semibold">{userData.name}</p>
          )}
        </div>


        <div className="text-center mt-4">
          {isEdit ? (
            <input
              className="w-full p-2 bg-white rounded-md border border-cyan-400"
              type="text"
              value={userData.name}
              onChange={(e) => setUserData((prev) => ({ ...prev, name: e.target.value }))}
            />
          ) : (
            <p className="text-xl font-semibold">{userData.name}</p>
          )}
        </div>
       
        

        <div className="mt-4 text-center">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? "Save" : "Edit Profile"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RUserProfile;
