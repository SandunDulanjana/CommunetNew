import React, { useState, useEffect } from 'react';
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

const AdminPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/member/members');
      setMembers(res.data.AllMembers || []);
    } catch (err) {
      console.error(err);
      setMembers([]);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axios.delete(`http://localhost:5000/api/member/deleteMember/${id}`);
        fetchMembers();
      } catch (err) {
        console.error(err);
        alert('Failed to delete member');
      }
    }
  };

  const handleUpdateRedirect = (id) => {
    navigate(`/AdminUpdate/${id}`); // Redirect to update page
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin - Manage Members</h1>

      {/* Add Member Button */}
      <button
        onClick={() => navigate('/Adminadd')}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mb-6"
      >
        Add New Member
      </button>

      {/* List Members */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Current Members</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">NIC</th>
                <th className="px-4 py-2">Member Type</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(members || []).map((member) => (
                <tr key={member._id} className="border-b">
                  <td className="px-4 py-2">{member.name}</td>
                  <td className="px-4 py-2">{member.email}</td>
                  <td className="px-4 py-2">{member.phoneNumber}</td>
                  <td className="px-4 py-2">{member.NIC}</td>
                  <td className="px-4 py-2">{member.memberType}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleUpdateRedirect(member._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {(members || []).length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
