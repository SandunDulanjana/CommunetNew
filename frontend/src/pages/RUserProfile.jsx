import { React, useState } from 'react';
import Footer from '../componenets/Footer';

const RUserProfile = () => {
  const [userData, setUserData] = useState({
    name: 'Sandun',
    bio: "Hello, I'm Sandun",
    email: 'sandun@gmail.com',
    houseNO: '301',
    phoneNumber: '0123456789',
    gender: 'Male',
    NIC: '2001518111',
  });

  const [isEdit, setIsEdit] = useState(true);

  return (
    <div>
      <div className="max-w-lg mx-auto bg-white text-black p-6 rounded-lg shadow-lg mt-16">
        <img className="w-24 h-24 rounded-full mx-auto border-4 border-cyan-400" src={userData.image} alt="Profile" />

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

        <div className="mt-4 space-y-2">
          <div>
            <p className="text-gray-400">Bio:</p>
            {isEdit ? (
              <input
                className="w-full p-2 bg-white rounded-md border border-cyan-400"
                type="text"
                value={userData.bio}
                onChange={(e) => setUserData((prev) => ({ ...prev, bio: e.target.value }))}
              />
            ) : (
              <p>{userData.bio}</p>
            )}
          </div>

          <div>
            <p className="text-gray-400">Gender:</p>
            {isEdit ? (
              <select
                className="w-full p-2 bg-white rounded-md border border-cyan-400"
                onChange={(e) => setUserData((prev) => ({ ...prev, gender: e.target.value }))}
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p>{userData.gender}</p>
            )}

          </div>

          <div>
            <p className="text-gray-400">NIC:</p>
            {isEdit ? (
              <input
                className="w-full p-2 bg-white rounded-md border border-cyan-400"
                type="text"
                value={userData.NIC}
                onChange={(e) => setUserData((prev) => ({ ...prev, NIC: e.target.value }))}
              />
            ) : (
              <p>{userData.NIC}</p>
            )}
          </div>
        </div>

        <hr className="my-4 border-gray-700" />

        <div>
        <p className="text-lg font-semibold text-blue-950 text-center">CONTACT INFORMATION</p>

          <div className="mt-3 space-y-2">
            <div>
              <p className="text-gray-400">House NO:</p>
              {isEdit ? (
                <input
                  className="w-full p-2 bg-white rounded-md border border-cyan-400"
                  type="text"
                  value={userData.houseNO}
                  onChange={(e) => setUserData((prev) => ({ ...prev, houseNO: e.target.value }))}
                />
              ) : (
                <p>{userData.houseNO}</p>
              )}
            </div>

            <div>
              <p className="text-gray-400">Phone:</p>
              {isEdit ? (
                <input
                  className="w-full p-2 bg-white rounded-md border border-cyan-400"
                  type="text"
                  value={userData.phoneNumber}
                  onChange={(e) => setUserData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                />
              ) : (
                <p>{userData.phoneNumber}</p>
              )}
            </div>

            <div>
              <p className="text-gray-400">Email:</p>
              {isEdit ? (
                <input
                  className="w-full p-2 bg-white rounded-md border border-cyan-400"
                  type="text"
                  value={userData.email}
                  onChange={(e) => setUserData((prev) => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <p>{userData.email}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-white"
            onClick={() => setIsEdit((prev) => !prev)}
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
