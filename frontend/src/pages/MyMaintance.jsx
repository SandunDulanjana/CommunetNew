import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../componenets/Footer";
import axios from "axios";
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

const MyMaintenance = () => {
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMaintenance = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please log in to view your maintenance requests");
        setLoading(false);
        return;
      }

      // Fetch all maintenance requests with authentication
      const response = await axios.get(
        "http://localhost:5000/api/maintenance/displayAllMaintenanceRequests",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Maintenance response:', response.data); // Debug log

      if (response.data.success) {
        // Get user email from the token
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userEmail = decodedToken.email;

        // Filter requests for the logged-in user and ensure status is set
        const userRequests = response.data.AllMaintainanceRequests
          .filter(request => request.email === userEmail)
          .map(request => ({
            ...request,
            status: request.status || 'pending',
            rejectionReason: request.rejectionReason || ''
          }));
        
        console.log('Filtered user requests:', userRequests); // Debug log
        setMaintenance(userRequests);
      } else {
        setError(response.data.message || "Failed to fetch data.");
      }
    } catch (error) {
      console.error("Error fetching maintenance:", error);
      setError("Failed to load maintenance data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  // Add refresh function
  const refreshMaintenance = () => {
    setLoading(true);
    fetchMaintenance();
  };

  const handleEdit = (id) => {
    navigate(`/EditMaintenance/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please log in to delete maintenance requests");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this maintenance request?"
      );
      if (confirmDelete) {
        await axios.delete(
          `http://localhost:5000/api/maintenance/DeleteMaintenanceRequest/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert("Maintenance request deleted successfully");
        // Refresh the list after deletion
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      alert("Failed to delete maintenance request. Try again later.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (loading) {
    return <div className="text-center text-xl p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg p-10">{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col min-h-screen p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Maintenance Requests</h1>
          <button
            onClick={() => navigate("/AddMaintenance")}
            className="bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-lg hover:bg-blue-600 transition"
          >
            Add Maintenance
          </button>
        </div>

        <div className="overflow-x-auto">
          {maintenance.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                No Maintenance Requests Found
              </h2>
              <p className="text-gray-500 mb-8">
                You haven't submitted any maintenance requests yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {maintenance.map((request) => (
                <div key={request._id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  {/* Image Section */}
                  <div className="relative h-48">
                    {request.images ? (
                      <img
                        src={request.images}
                        alt="Maintenance request"
                        className="w-full h-full object-cover rounded-t-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-image.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <span className="text-gray-500">No image available</span>
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">House No:</span> {request.houseNo || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Category:</span> {request.category || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Priority:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          request.priority === 'High' ? 'bg-red-100 text-red-800' :
                          request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.priority || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Description:</span>
                        <p className="mt-1 text-gray-700">{request.details || "N/A"}</p>
                      </p>
                      {request.status === 'rejected' && request.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 rounded">
                          <p className="text-sm text-red-700">
                            <span className="font-medium">Rejection Reason:</span>
                            <p className="mt-1">{request.rejectionReason}</p>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {request.status === 'pending' && (
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(request._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit Request"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(request._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Request"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MyMaintenance;
