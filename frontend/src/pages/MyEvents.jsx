import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../componenets/Footer';
import axios from 'axios';

const MyEvents = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const userId = localStorage.getItem("userId");
      console.log("User ID from localStorage:", userId);

      if (!userId) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/event/single-event/${userId}`);
        console.log("API Response:", response.data);

        if (response.data && response.data.event) {
          setEvent(response.data.event);
        } else {
          setError("No event found.");
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError("Failed to fetch event.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, []);

  if (loading) return <div className="p-4">Loading event data...</div>;

  if (error) {
    return (
      <div className="p-4">
        <p className="text-lg text-gray-700 mb-4">{error}</p>
        <button
          onClick={() => navigate("/AddEvent")}
          className="bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-lg hover:bg-blue-600 transition"
        >
          Add Event
        </button>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Details</h1>
        <button
          onClick={() => navigate("/AddEvent")}
          className="bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-lg hover:bg-blue-600 transition"
        >
          Add Event
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Event Name</th>
              <th className="p-2 border">Organizer Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Venue</th>
              <th className="p-2 border">Contact No</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Expected Count</th>
              <th className="p-2 border">Request Type</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className="p-2 border">{event.eventName}</td>
              <td className="p-2 border">{event.organizarName}</td>
              <td className="p-2 border">{event.discription}</td>
              <td className="p-2 border">{event.date}</td>
              <td className="p-2 border">{event.time}</td>
              <td className="p-2 border">{event.venue}</td>
              <td className="p-2 border">{event.organizarContactNo}</td>
              <td className="p-2 border">{event.organizarEmail}</td>
              <td className="p-2 border">{event.expectedCount}</td>
              <td className="p-2 border">{event.requestType}</td>
              <td className="p-2 border">
                <button
                  onClick={() => navigate(`/UpdateEvent/${event._id}`)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition"
                >
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
};

export default MyEvents;
