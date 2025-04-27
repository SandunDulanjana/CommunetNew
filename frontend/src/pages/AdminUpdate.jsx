import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminUpdate = () => {
  const { id } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    houseNO: '',
    phoneNumber: '',
    gender: '',
    NIC: '',
    memberType: '',
  });

  const memberTypes = [
    "member",
    "admin",
    "electioncoordinator",
    "eventcoordinator",
    "maintenancecoordinator",
    "financecoordinator",
    "communicationcoordinator"
  ];

  // Fetch member details
  const fetchMember = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/member/members`);
      const member = res.data.AllMembers.find(m => m._id === id);
      if (member) {
        setFormData({
          name: member.name || '',
          email: member.email || '',
          houseNO: member.houseNO || '',
          phoneNumber: member.phoneNumber || '',
          gender: member.gender || '',
          NIC: member.NIC || '',
          memberType: member.memberType || '',
        });
      } else {
        alert("Member not found!");
        navigate('/AdminPage'); // Redirect if not found
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch member data");
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:5000/api/member/updateAdminMember/${id}`, formData);
      if (res.data.success) {
        alert('Member updated successfully!');
        navigate('/AdminPage'); // Go back after update
      } else {
        alert(res.data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update member');
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Update Member</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full border p-3 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-3 rounded"
            required
          />
          <input
            type="text"
            name="houseNO"
            value={formData.houseNO}
            onChange={handleChange}
            placeholder="House No"
            className="w-full border p-3 rounded"
            required
          />
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border p-3 rounded"
            required
          />
          <input
            type="text"
            name="NIC"
            value={formData.NIC}
            onChange={handleChange}
            placeholder="NIC"
            className="w-full border p-3 rounded"
            required
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <select
            name="memberType"
            value={formData.memberType}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          >
            <option value="">Select Member Type</option>
            {memberTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
            >
              Update Member
            </button>
            <button
              type="button"
              onClick={() => navigate('/AdminPage')}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdate;
