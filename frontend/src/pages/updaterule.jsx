import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateRule = () => {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRule = async () => {
      if (!id) {
        setMessage('No rule ID provided');
        setTimeout(() => navigate('/Rules'), 2000);
        return;
      }

      console.log('Fetching rule with ID:', id);
      try {
        const res = await axios.get(`http://localhost:5000/api/rules/displayrule/${id}`);
        console.log('Response from server:', res.data);
        
        if (res.data) {
          setTitle(res.data.Rule_subject || '');
          setDescription(res.data.discription || '');
        } else {
          console.error('Invalid response format:', res.data);
          setMessage('Rule not found or invalid response format');
          setTimeout(() => navigate('/Rules'), 2000);
        }
      } catch (err) {
        console.error('Error fetching rule:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setMessage('Rule not found or error occurred');
        setTimeout(() => navigate('/Rules'), 2000);
      }
      setFetching(false);
    };

    fetchRule();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      console.log('Sending update request with data:', {
        Rule_subject: title,
        discription: description
      });

      const res = await axios.put(`http://localhost:5000/api/rules/updaterule/${id}`, {
        Rule_subject: title,
        discription: description,
      });

      console.log('Update response:', res.data);
      
      if (res.data.success) {
        setMessage('Rule updated successfully');
        setTimeout(() => navigate('/Rules'), 1000);
      } else {
        setMessage(res.data.message || 'Failed to update rule');
      }
    } catch (err) {
      console.error('Error updating rule:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setMessage(err.response?.data?.message || 'Failed to update rule');
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (message && message.includes('not found')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-red-600">{message}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Update Rule</h1>
        {message && (
          <div className={`mb-4 text-center font-medium ${message.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
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
            {loading ? 'Updating...' : 'Update Rule'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRule; 