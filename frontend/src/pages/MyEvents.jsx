import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../componenets/Footer';
import axios from 'axios';

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      console.log("Token from localStorage:", token);

      if (!token) {
        setError('User not logged in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/event/my-events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("API Response:", response.data);

        if (response.data && response.data.event) {
          setEvents(response.data.event);
        } else {
          setError("No events found.");
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/event/delete-event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert("Failed to delete event. Please try again.");
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event-requests/${eventId}`);
  };

  // Filter events based on search
  const filteredEvents = events.filter(event => {
    const searchTerm = search.toLowerCase();
    return (
      event.eventName.toLowerCase().includes(searchTerm) ||
      event.organizarName.toLowerCase().includes(searchTerm) ||
      event.venue.toLowerCase().includes(searchTerm)
    );
  });

  if (loading) return <div className="p-4">Loading events...</div>;

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by event, organizer, or venue..."
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full md:w-64"
            />
            <button
              onClick={() => navigate("/AddEvent")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Add Event
            </button>
          </div>
        </div>
        {filteredEvents.length === 0 ? (
          <div className="text-center text-gray-500 mt-16">
            <p>No events found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer flex flex-col"
                onClick={() => handleEventClick(event._id)}
              >
                <h2 className="text-xl font-bold mb-2 text-blue-700">{event.eventName}</h2>
                <div className="mb-2 text-gray-700">
                  <p><span className="font-semibold">Organizer:</span> {event.organizarName}</p>
                  <p><span className="font-semibold">Date:</span> {event.date}</p>
                  <p><span className="font-semibold">Time:</span> {event.time}</p>
                  <p><span className="font-semibold">Venue:</span> {event.venue}</p>
                  <p><span className="font-semibold">Contact:</span> {event.organizarContactNo}</p>
                  <p><span className="font-semibold">Email:</span> {event.organizarEmail}</p>
                  <p><span className="font-semibold">Expected Count:</span> {event.expectedCount}</p>
                  <p><span className="font-semibold">Request Type:</span> {event.requestType}</p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      event.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      event.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status || 'Pending'}
                    </span>
                  </p>
                </div>
                <div className="mt-auto flex space-x-2">
                  {event.status !== 'Approved' && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        navigate(`/UpdateEvent/${event._id}`);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(event._id);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyEvents;
