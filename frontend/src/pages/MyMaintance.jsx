import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../componenets/Footer';
import axios from 'axios';
import AddMaintenance from './AddMaintenance';
import { BrowserRouter } from 'react-router-dom';

const MyMaintance = () => {
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState(null);

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/maintenance/MaintainanceRequest/67e29c883eb08c3ea25e5484`);
        console.log('response:', response);
        console.log('response data:', response.data);
        setMaintenance(response.data.MaintainanceRequest);
      } catch (error) {
        console.error('Error fetching maintenance:', error);
      }
    };

    fetchMaintenance();
  }, []);

  const handleEdit = (id) => {
    // Navigate to the edit page with the maintenance ID
    navigate(`/EditMaintenance/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this maintenance request?');
      if (confirmDelete) {
        await axios.delete(`http://localhost:5000/api/maintenance/MaintainanceRequest/${id}`);
        alert('Maintenance request deleted successfully');
        navigate('/'); // Redirect to the home page or the list of requests
      }
    } catch (error) {
      console.error('Error deleting maintenance:', error);
    }
  };

  if (!maintenance) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col min-h-screen p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Maintenance Details</h1>
          <button
            onClick={() => navigate('/AddMaintenance')}
            className="bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-lg hover:bg-blue-600 transition"
          >
            Add Maintenance
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">House owner name</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">House number</th>
                <th className="p-2 border">Maintenance type</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Priority</th>
                <th className="p-2 border">Images</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100">
                <td className="p-2 border">{maintenance.name}</td>
                <td className="p-2 border">{maintenance.phone}</td>
                <td className="p-2 border">{maintenance.email}</td>
                <td className="p-2 border">{maintenance.houseNo}</td>
                <td className="p-2 border">{maintenance.category}</td>
                <td className="p-2 border">{maintenance.details}</td>
                <td className="p-2 border">{maintenance.priority}</td>
                <td className="p-2 border">{maintenance.images}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEdit(maintenance._id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(maintenance._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MyMaintance;
