import React, { useEffect, useState } from 'react'
import Footer from '../componenets/Footer'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Rules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('http://localhost:5000/api/rules/displayrule', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (res.data.Allrules) {
          setRules(res.data.Allrules || []);
        } else {
          setError('Failed to fetch rules');
        }
      } catch (err) {
        console.error('Error fetching rules:', err);
        setError('Failed to connect to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      try {
        console.log('Deleting rule with ID:', id);
        const res = await axios.delete(`http://localhost:5000/api/rules/deleterule/${id}`);
        console.log('Delete response:', res.data);
        
        if (res.data.success) {
          setRules(rules.filter(rule => rule._id !== id));
          alert('Rule deleted successfully');
        } else {
          alert(res.data.message || 'Failed to delete rule');
        }
      } catch (err) {
        console.error('Error deleting rule:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        alert(err.response?.data?.message || 'Failed to delete rule');
      }
    }
  };

  const handleUpdate = (id) => {
    console.log('Updating rule with ID:', id);
    navigate(`/updaterule/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <button
              onClick={() => navigate('/AdminPage')}
              className="hover:text-blue-600 text-left w-full"
            >
              Add Member
            </button>
          </li>
          <li className="text-blue-600 font-semibold">Add Rules</li>
        </ul>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Rules</h1>
          <button
            onClick={() => navigate('/addrule')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add Rule
          </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">All Rules</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No rules found.
                    </td>
                  </tr>
                ) : (
                  rules.map((rule) => (
                    <tr key={rule._id} className="border-b">
                      <td className="px-4 py-2">{rule.Rule_subject}</td>
                      <td className="px-4 py-2">{rule.discription}</td>
                      <td className="px-4 py-2">
                        {new Date(rule.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => handleUpdate(rule._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(rule._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Rules