import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../componenets/Footer';

function MaintanCoPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state for requests
  const [error, setError] = useState(null); // Error state to handle API call failures

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/maintenance/displayAllMaintainRequests`);
        console.log('response data:', response.data);
        // Check if response data contains MaintainanceRequest and set it, else set empty array
        setRequests(response.data.AllMaintainanceRequests || []);
        setIsLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching maintenance:', error);
        setError('Failed to fetch maintenance requests');
        setIsLoading(false); // Stop loading on error
      }
    };

    fetchMaintenance();
  }, []);

  const handleAccept = (id) => {
    // Handle accept logic
    console.log(`Accepted request with id: ${id}`);
  };

  const handleReject = (id) => {
    // Handle reject logic
    console.log(`Rejected request with id: ${id}`);
  };

  if (isLoading) {
    return <div>Loading maintenance requests...</div>; // Show loading message
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there is one
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Maintenance Requests</h2>
      {requests.length === 0 ? (
        <div>No maintenance requests available.</div> // Display when there are no requests
      ) : (
        requests.map((request) => (
          <div key={request.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <p><strong>Full Name:</strong> {request.name}</p>
            <p><strong>Phone Number:</strong> {request.phone}</p>
            <p><strong>Email Address:</strong> {request.email}</p>
            <p><strong>House Number:</strong> {request.house}</p>
            <p><strong>Issue Type:</strong> {request.issueType}</p>
            <p><strong>Description:</strong> {request.description}</p>
            <p><strong>Priority:</strong> {request.priority}</p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleAccept(request.id)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MaintanCoPage;
