import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../componenets/Footer';
import { FaDownload } from 'react-icons/fa';

function MaintanCoPage() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state for requests
  const [error, setError] = useState(null); // Error state to handle API call failures
  
  // Filter states
  const [filters, setFilters] = useState({
    priority: '',
    category: '',
    houseNo: ''
  });

  // Rejection dialog states
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // New state for active tab

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/maintenance/displayAllMaintenanceRequests`);
        console.log('response data:', response.data);
        const allRequests = response.data.AllMaintainanceRequests || [];
        setRequests(allRequests);
        // Initial filter based on active tab
        filterRequestsByStatus(allRequests, activeTab);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching maintenance:', error);
        setError('Failed to fetch maintenance requests');
        setIsLoading(false);
      }
    };

    fetchMaintenance();
  }, []);

  // Function to filter requests by status
  const filterRequestsByStatus = (requestsToFilter, status) => {
    let filtered;
    switch (status) {
      case 'accepted':
        filtered = requestsToFilter.filter(request => request.status === 'accepted');
        break;
      case 'rejected':
        filtered = requestsToFilter.filter(request => request.status === 'rejected');
        break;
      case 'pending':
      default:
        filtered = requestsToFilter.filter(request => 
          request.status !== 'accepted' && request.status !== 'rejected'
        );
        break;
    }
    setFilteredRequests(filtered);
  };

  // Update filtered requests when tab changes
  useEffect(() => {
    filterRequestsByStatus(requests, activeTab);
  }, [activeTab, requests]);

  // Apply additional filters (priority, category, houseNo)
  useEffect(() => {
    let filtered = [...requests];

    // First filter by status
    filtered = filtered.filter(request => {
      if (activeTab === 'accepted') return request.status === 'accepted';
      if (activeTab === 'rejected') return request.status === 'rejected';
      return request.status !== 'accepted' && request.status !== 'rejected';
    });

    // Then apply other filters
    if (filters.priority) {
      filtered = filtered.filter(request => request.priority === filters.priority);
    }
    if (filters.category) {
      filtered = filtered.filter(request => request.category === filters.category);
    }
    if (filters.houseNo) {
      filtered = filtered.filter(request => request.houseNo.toString() === filters.houseNo);
    }

    setFilteredRequests(filtered);
  }, [filters, requests, activeTab]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      priority: '',
      category: '',
      houseNo: ''
    });
  };

  const handleAccept = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/maintenance/accept/${id}`
      );

      if (response.data.success) {
        // Remove the accepted request from both lists
        setRequests(prevRequests => 
          prevRequests.filter(request => request._id !== id)
        );
        setFilteredRequests(prevRequests => 
          prevRequests.filter(request => request._id !== id)
        );
        alert('Request accepted successfully');
      } else {
        throw new Error(response.data.message || 'Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      alert(error.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleRejectClick = (id) => {
    setSelectedRequestId(id);
    setShowRejectDialog(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/maintenance/reject/${selectedRequestId}`,
        { rejectionReason }
      );

      // Remove the rejected request from the list
      setRequests(prevRequests => 
        prevRequests.filter(request => request._id !== selectedRequestId)
      );
      setFilteredRequests(prevRequests => 
        prevRequests.filter(request => request._id !== selectedRequestId)
      );

      // Close dialog and reset states
      setShowRejectDialog(false);
      setSelectedRequestId(null);
      setRejectionReason('');
      alert('Request rejected successfully');
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseDialog = () => {
    setShowRejectDialog(false);
    setSelectedRequestId(null);
    setRejectionReason('');
  };

  const handleGenerateReport = async () => {
    try {
      setGeneratingReport(true);
      const response = await axios.get(
        'http://localhost:5000/api/maintenance/generate-report',
        { responseType: 'blob' }
      );

      // Create a blob from the PDF data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `maintenance_report_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Append link to body, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  if (isLoading) {
    return <div>Loading maintenance requests...</div>; // Show loading message
  }

  if (error) {
    return <div>{error}</div>; // Show error message if there is one
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Maintenance Requests</h1>
        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
        >
          <FaDownload />
          {generatingReport ? 'Generating...' : 'Generate Report'}
        </button>
      </div>

      {/* Status Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'accepted'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Accepted Requests
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'rejected'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Rejected Requests
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Filter Requests</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Issue Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* House Number Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
            <input
              type="text"
              name="houseNo"
              value={filters.houseNo}
              onChange={handleFilterChange}
              placeholder="Enter house number"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-gray-600">
        Showing {filteredRequests.length} of {requests.length} requests
      </div>

      {/* Requests Grid */}
      {filteredRequests.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No {activeTab} maintenance requests match the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRequests.map((request) => (
            <div key={request._id} className="bg-white p-4 rounded-lg shadow">
              {/* Image Display */}
              <div className="mb-4">
                {request.images ? (
                  <img
                    src={request.images}
                    alt="Maintenance request"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/default-image.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No image available</span>
                  </div>
                )}
              </div>

              {/* Request Details */}
              <div className="space-y-2">
                <p><strong>Full Name:</strong> {request.name}</p>
                <p><strong>Phone Number:</strong> {request.phone}</p>
                <p><strong>Email Address:</strong> {request.email}</p>
                <p><strong>House Number:</strong> {request.houseNo}</p>
                <p><strong>Issue Type:</strong> {request.category}</p>
                <p><strong>Description:</strong> {request.details}</p>
                <p><strong>Priority:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    request.priority === 'High' ? 'bg-red-100 text-red-800' :
                    request.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {request.priority}
                  </span>
                </p>
                {request.status === 'rejected' && (
                  <p className="text-red-600">
                    <strong>Rejection Reason:</strong> {request.rejectionReason}
                  </p>
                )}
              </div>

              {/* Action Buttons - Only show for pending requests */}
              {activeTab === 'pending' && (
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => handleAccept(request._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectClick(request._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Rejection Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Reject Maintenance Request</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Please provide a reason for rejecting this request..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MaintanCoPage;
