import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../componenets/Footer';
import axios from 'axios';

const UpdateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState({
    eventName: '',
    organizarName: '',
    discription: '',
    date: '',
    time: '',
    venue: '',
    organizarContactNo: '',
    organizarEmail: '',
    expectedCount: '',
    requestType: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError('Please login to update event');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/event/my-events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.event) {
          // Find the specific event by ID from the array of events
          const eventToUpdate = response.data.event.find(e => e._id === id);
          if (eventToUpdate) {
            setEvent(eventToUpdate);
          } else {
            setError('Event not found');
          }
        } else {
          setError('No events found');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert('Please login to update event');
        return;
      }
      const response = await axios.put(
        `http://localhost:5000/api/event/update-event/${id}`,
        event,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );


      if (response.data.success) {
        alert('Event updated successfully');
        navigate('/MyEvents');
      } else {
        alert(response.data.message || 'Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error.response?.data || error.message);
      alert('Failed to update event. Please try again.');
    }
  };

  if (loading) return <div className="p-4">Loading event details...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-8 text-center">Update Event</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={event.eventName}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Organizer Name</label>
            <input
              type="text"
              name="organizarName"
              value={event.organizarName}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="discription"
              value={event.discription}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Time</label>
            <input
              type="time"
              name="time"
              value={event.time}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Venue</label>
            <input
              type="text"
              name="venue"
              value={event.venue}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Contact Number</label>
            <input
              type="text"
              name="organizarContactNo"
              value={event.organizarContactNo}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="organizarEmail"
              value={event.organizarEmail}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Expected Count</label>
            <input
              type="number"
              name="expectedCount"
              value={event.expectedCount}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Request Type</label>
            <select
              name="requestType"
              value={event.requestType}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            >
              <option value="">Select a request type</option>
              <option value="Request to Join">Request to Join</option>
              <option value="All In">All In</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/my-events')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Update Event
          </button>
        </div>
      </form>
      <Footer />
    </div>
  );
};

export default UpdateEvent;
