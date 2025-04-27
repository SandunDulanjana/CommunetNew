import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const memberTypes = [
  "member",
  "admin",
  "electioncoordinator",
  "eventcoordinator",
  "maintenancecoordinator",
  "financecoordinator",
  "communicationcoordinator"
];

function Adminadd() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    houseNO: '',
    phoneNumber: '',
    gender: '',
    NIC: '',
    memberType: 'member',
    password: '',
    confirmPassword: '' // ✅ New field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match! Please try again.');
      return; // Stop submitting
    }

    try {
      const { confirmPassword, ...dataToSend } = formData; // Exclude confirmPassword when sending

      await axios.post('http://localhost:5000/api/member/add-member', dataToSend, {
        headers: { 'Content-Type': 'application/json' }
      });

      alert('Member added successfully!');
      setFormData({
        name: '',
        email: '',
        houseNO: '',
        phoneNumber: '',
        gender: '',
        NIC: '',
        memberType: 'member',
        password: '',
        confirmPassword: ''
      });
      navigate('/AdminPage');
    } catch (err) {
      console.error('Error adding member:', err.response ? err.response.data : err.message);
      alert('Failed to add member');
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8 grid gap-4 max-w-lg mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Add New Member</h2>

        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border p-2 rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border p-2 rounded" required />
        <input type="text" name="houseNO" placeholder="House Number" value={formData.houseNO} onChange={handleChange} className="border p-2 rounded" required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} className="border p-2 rounded" required />
        <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded" required />
        <input type="text" name="NIC" placeholder="NIC" value={formData.NIC} onChange={handleChange} className="border p-2 rounded" required />

        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="border p-2 rounded" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="border p-2 rounded" required />

        <select name="memberType" value={formData.memberType} onChange={handleChange} className="border p-2 rounded" required>
          {memberTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Add Member
        </button>
      </form>
    </div>
  );
}

export default Adminadd;
