import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../componenets/Footer';
import axios from 'axios';

const MyEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const eventDetailRef = useRef(null); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/event/all-events`);
        console.log('response:', response);
        setEvents(response.data.AllEvent || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Handle clicking an event box
  const handleEventClick = (event) => {
    setSelectedEvent(event); // Set the selected event to display details
    eventDetailRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the event details block
  };

  // Handle the Request button click
  const handleRequestClick = (event) => {
    alert(`Request sent for the event: ${event.eventName}`);
    
  };

  const handleGetQR = () => {
    if (selectedEvent && selectedEvent._id) {
      navigate(`/qr/${selectedEvent._id}`);
    }
  };

  if (!events || events.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Events</h1>
      </div>

      {/* Container for the event boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="cursor-pointer p-4 border rounded-lg shadow-lg hover:bg-gray-100"
            onClick={() => handleEventClick(event)} // Set selected event on click
          >
            <h3 className="text-lg font-semibold">{event.eventName}</h3>
            <p className="text-sm text-gray-600">{event.organizarName}</p>
            <p className="text-sm text-gray-600">{event.date} | {event.time}</p>

            
            {event.requestType === 'Request to Join' && (
              <button 
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the card click handler from firing
                  handleRequestClick(event); // Handle the request button click
                }}
              >
                
                Request
              </button>
            )}
            
          </div>
        ))}
      </div>

      
      {selectedEvent && (
        <div ref={eventDetailRef} className="mt-8 p-6 border rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-bold mb-4">Event Details</h2>
          <div className="mb-2"><strong>Event Name:</strong> {selectedEvent.eventName}</div>
          <div className="mb-2"><strong>Organizer Name:</strong> {selectedEvent.organizarName}</div>
          <div className="mb-2"><strong>Description:</strong> {selectedEvent.discription}</div>
          <div className="mb-2"><strong>Date:</strong> {selectedEvent.date}</div>
          <div className="mb-2"><strong>Time:</strong> {selectedEvent.time}</div>
          <div className="mb-2"><strong>Venue:</strong> {selectedEvent.venue}</div>
          <div className="mb-2"><strong>Contact No:</strong> {selectedEvent.organizarContactNo}</div>
          <div className="mb-2"><strong>Email:</strong> {selectedEvent.organizarEmail}</div>
          <div className="mb-2"><strong>Expected Count:</strong> {selectedEvent.expectedCount}</div>
          <div className="mb-2"><strong>Request Type:</strong> {selectedEvent.requestType}</div>
          <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={handleGetQR}>GetQR</button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default MyEvents;
