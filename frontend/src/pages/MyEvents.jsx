import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../componenets/Footer';
import axios from 'axios';

const MyEvents = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/event/single-event/67d2c4062c5651aacd300548');
        console.log('response:', response);
        console.log('response data:', response.data);
        setEvent(response.data.event);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, []);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Details</h1>
        <button
          onClick={() => navigate('/AddEvent')}
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
            </tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
};

export default MyEvents;
