import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../componenets/Footer';
import axios from 'axios';
import { motion } from 'framer-motion';
import eventHeroImg from '../assets/eventback.jpg';

const Event = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestStatus, setRequestStatus] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/event/all-events`);
        // Filter to show only approved events
        const approvedEvents = response.data.AllEvent.filter(event => event.status === 'Approved');
        setEvents(approvedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle clicking an event card
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Handle the Request button click
  const handleRequestClick = (event) => {
    setSelectedEvent(event);
    setShowRequestModal(true);
    setShowEventDetails(false); // Close event details when opening request form
  };

  const handleRequestSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setRequestStatus('Please login to request to join events');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/event/request-event',
        {
          eventId: selectedEvent._id,
          message: requestMessage
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setRequestStatus('Request sent successfully!');
        setRequestMessage('');
        setTimeout(() => {
          setShowRequestModal(false);
          setRequestStatus('');
        }, 2000);
      } else {
        setRequestStatus(response.data.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      setRequestStatus(error.response?.data?.message || 'Failed to send request');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    </div>
  );

  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <section className="relative h-[40vh] bg-blue-600">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img
            src={eventHeroImg}
            alt="Community Events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">Community Events</h1>
              <p className="text-xl">Discover and join exciting community events</p>
            </div>
          </div>
        </section>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-500 text-lg">No approved events available</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <section className="relative h-[40vh] bg-blue-600">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={eventHeroImg}
          alt="Community Events"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Community Events</h1>
            <p className="text-xl">Discover and join exciting community events</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Upcoming Events</h2>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {events.map((event) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
              onClick={() => handleEventClick(event)}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold text-blue-700 mb-3">{event.eventName}</h3>
                <div className="space-y-2">
                  <p className="text-gray-700 flex items-center">
                    <span className="font-semibold mr-2">Organizer:</span>
                    <span className="text-gray-600">{event.organizarName}</span>
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date} | {event.time}
                  </p>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.venue}
                  </p>
                  <p className="text-gray-600 line-clamp-2">
                    <span className="font-semibold">Description:</span> {event.discription}
                  </p>
                </div>
                {event.requestType === 'Request to Join' && (
                  <button 
                    className="mt-4 w-full bg-blue-500 text-white py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRequestClick(event);
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Request to Join Event
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Event Details Modal */}
        {showEventDetails && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative"
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl transition-colors"
                onClick={() => setShowEventDetails(false)}
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold mb-6 text-blue-700">{selectedEvent.eventName}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-semibold text-gray-700">Organizer Name:</span> {selectedEvent.organizarName}</p>
                    <p className="mb-2"><span className="font-semibold text-gray-700">Date:</span> {selectedEvent.date}</p>
                    <p className="mb-2"><span className="font-semibold text-gray-700">Time:</span> {selectedEvent.time}</p>
                    <p className="mb-2"><span className="font-semibold text-gray-700">Venue:</span> {selectedEvent.venue}</p>
                    <p className="mb-2"><span className="font-semibold text-gray-700">Expected Count:</span> {selectedEvent.expectedCount}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="mb-2"><span className="font-semibold text-gray-700">Description:</span> {selectedEvent.discription}</p>
                    <p className="mb-2"><span className="font-semibold text-gray-700">Contact No:</span> {selectedEvent.organizarContactNo}</p>
                    <p className="mb-2"><span className="font-semibold text-gray-700">Email:</span> {selectedEvent.organizarEmail}</p>
                    <p className="mb-2"><span className="font-semibold text-gray-700">Request Type:</span> {selectedEvent.requestType}</p>
                  </div>
                </div>
              </div>
              {selectedEvent.requestType === 'Request to Join' && (
                <div className="flex justify-end mt-8 space-x-4">
                  <button
                    className="bg-blue-500 text-white py-2.5 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
                    onClick={() => {
                      setShowEventDetails(false);
                      handleRequestClick(selectedEvent);
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Request to Join Event
                  </button>
                  <button
                    className="bg-green-500 text-white py-2.5 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center"
                    onClick={() => {
                      setShowEventDetails(false);
                      navigate(`/event-qr/${selectedEvent._id}`);
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v2m0 5h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 20h4M4 16h4" />
                    </svg>
                    Show Attendance QR
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-6 text-blue-700">Request to Join Event</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-800 text-lg">{selectedEvent.eventName}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedEvent.date} | {selectedEvent.time}</p>
                <p className="text-sm text-gray-600">Venue: {selectedEvent.venue}</p>
              </div>
              <textarea
                value={requestMessage}
                onChange={e => setRequestMessage(e.target.value)}
                placeholder="Enter your message to the organizer..."
                className="w-full p-4 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                rows="4"
                required
              />
              {requestStatus && (
                <div className={`mb-4 p-3 rounded-lg ${
                  requestStatus.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {requestStatus}
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowRequestModal(false);
                    setRequestMessage('');
                    setRequestStatus('');
                  }}
                  className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestSubmit}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!requestMessage.trim()}
                >
                  Send Request
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
};

export default Event;
