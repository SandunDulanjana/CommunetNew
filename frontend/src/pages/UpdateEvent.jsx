import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../componenets/Footer';
import axios from 'axios';

const MyEvents = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const eventId = '67d2c4062c5651aacd300548';

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/event/single-event/${eventId}`);
        console.log('Event data:', response.data);
        setEvent(response.data.event || {});
      } catch (error) {
        console.error('Error fetching event:', error);
        alert('Failed to fetch event');
      }
    };
    fetchEvent();
  }, []);

  const deleteEvent = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/event/delete-event/${eventId}`);
        alert('Event deleted successfully');
        navigate('/events');
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const updateEvent = async () => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/event/update-event/${eventId}`, event);
      console.log('Update response:', data);
      if (data.success) {
        alert('Event updated successfully');
        setIsEdit(false);
      } else {
        alert('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (!event || Object.keys(event).length === 0) {
    return <div>Loading event details...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Event Details</h1>
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
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100">
              <td className="p-2 border">
                {isEdit ? (
                  <input
                    type="text"
                    value={event?.eventName || ''}
                    onChange={(e) => setEvent({ ...event, eventName: e.target.value })}
                  />
                ) : (
                  event.eventName
                )}
              </td>
              <td className="p-2 border">{event?.organizerName || 'N/A'}</td>
              <td className="p-2 border">
                {isEdit ? (
                  <textarea
                    value={event?.description || ''}
                    onChange={(e) => setEvent({ ...event, description: e.target.value })}
                  />
                ) : (
                  event.description
                )}
              </td>
              <td className="p-2 border">{event?.date || 'N/A'}</td>
              <td className="p-2 border">{event?.time || 'N/A'}</td>
              <td className="p-2 border">{event?.venue || 'N/A'}</td>
              <td className="p-2 border">{event?.organizerContactNo || 'N/A'}</td>
              <td className="p-2 border">{event?.organizerEmail || 'N/A'}</td>
              <td className="p-2 border">{event?.expectedCount || 'N/A'}</td>
              <td className="p-2 border">
                {isEdit ? (
                  <button onClick={updateEvent} className="bg-green-500 text-white px-4 py-1 rounded-lg mr-2">
                    Save
                  </button>
                ) : (
                  <button onClick={() => setIsEdit(true)} className="bg-yellow-500 text-white px-4 py-1 rounded-lg mr-2">
                    Edit
                  </button>
                )}
                <button onClick={deleteEvent} className="bg-red-500 text-white px-4 py-1 rounded-lg">
                  Delete
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
