import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../componenets/Footer';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EventRequest = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventAndRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view event requests');
          setLoading(false);
          return;
        }

        // Fetch event details
        const eventResponse = await axios.get(`http://localhost:5000/api/event/single-event/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Fetch event requests
        const requestsResponse = await axios.get(`http://localhost:5000/api/event/event-requests/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (eventResponse.data.success) {
          let eventData = eventResponse.data.event;
          // If eventData is an array, use the first element
          if (Array.isArray(eventData)) {
            eventData = eventData[0] || null;
          }
          setEvent(eventData);
        }
        
        if (requestsResponse.data.success) {
          setRequests(requestsResponse.data.requests || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch event requests');
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndRequests();
  }, [eventId]);

  const handleRequestStatus = async (requestId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/event/update-request/${requestId}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Update the request status in the local state
        setRequests(requests.map(request => 
          request._id === requestId ? { ...request, status } : request
        ));
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Failed to update request status');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Event Details
    doc.setFontSize(16);
    doc.text(event.eventName, 10, 10);
    doc.setFontSize(12);
    doc.text(`Organizer: ${event.organizarName || ''}`, 10, 20);
    doc.text(`Contact: ${event.organizarContactNo || ''}`, 100, 20);
    doc.text(`Date: ${event.date || ''}`, 10, 28);
    doc.text(`Email: ${event.organizarEmail || ''}`, 100, 28);
    doc.text(`Time: ${event.time || ''}`, 10, 36);
    doc.text(`Expected Count: ${event.expectedCount || ''}`, 100, 36);
    doc.text(`Venue: ${event.venue || ''}`, 10, 44);
    doc.text(`Status: ${event.status || ''}`, 100, 44);

    // Event Requests Table
    const tableColumn = ["Name", "Email", "Phone", "Message", "Status"];
    const tableRows = requests.map(req => [
      req.requesterName,
      req.requesterEmail,
      req.requesterPhone,
      req.message,
      req.status
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
    });

    doc.save(`${event.eventName || 'event'}_requests.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={handleDownloadPDF}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Download PDF
        </button>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">{event.eventName}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Organizer:</span> {event[0]?.organizarName}</p>
              <p><span className="font-semibold">Date:</span> {event.date}</p>
              <p><span className="font-semibold">Time:</span> {event.time}</p>
              <p><span className="font-semibold">Venue:</span> {event.venue}</p>
            </div>
            <div>
              <p><span className="font-semibold">Contact:</span> {event.organizarContactNo}</p>
              <p><span className="font-semibold">Email:</span> {event.organizarEmail}</p>
              <p><span className="font-semibold">Expected Count:</span> {event.expectedCount}</p>
              <p><span className="font-semibold">Status:</span> {event.status}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Event Requests</h2>
          {!requests || requests.length === 0 ? (
            <p className="text-gray-500">No requests yet</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request._id} className="border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-semibold">Name:</span> {request.requesterName}</p>
                      <p><span className="font-semibold">Email:</span> {request.requesterEmail}</p>
                      <p><span className="font-semibold">Phone:</span> {request.requesterPhone}</p>
                    </div>
                    <div>
                      <p><span className="font-semibold">Message:</span> {request.message}</p>
                      <p><span className="font-semibold">Status:</span> {request.status}</p>
                    </div>
                  </div>
                  {request.status === 'Pending' && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handleRequestStatus(request._id, 'Approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRequestStatus(request._id, 'Rejected')}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EventRequest; 