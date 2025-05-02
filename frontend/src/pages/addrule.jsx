import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddRule = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/rules/addrules', {
        Rule_subject: title,
        discription: description,
      });
      setMessage(res.data.message);
      if (res.data.success) {
        setTimeout(() => navigate('/Rules'), 1200);
      }
    } catch (err) {
      setMessage('Failed to add rule');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Add New Rule</h1>
        {message && (
          <div className={`mb-4 text-center font-medium ${message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-900 text-sm font-semibold mb-2">Rule Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter rule title"
              required
            />
          </div>
          <div>
            <label className="block text-blue-900 text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter rule description"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-lg transition shadow-lg"
          >
            {loading ? 'Adding...' : 'Add Rule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRule; 