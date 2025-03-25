import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventCoPage = () => {
    const [Allevents, setAllEvents] = useState([]);

    // Fetch events from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/event/all-events');
                console.log(response.data); // Log the response data
                setAllEvents(response.data.AllEvent);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        console.log('Events:', Allevents);
    }, [Allevents]);

    // Update event status
    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/events/${id}`, { status });
            setAllEvents(Allevents.map(event => event._id === id ? { ...event, status } : event));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Event Approval Dashboard</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 border">Event Name</th>
                        <th className="p-2 border">Organizer</th>
                        <th className="p-2 border">Description</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Time</th>
                        <th className="p-2 border">Venue</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(Allevents) && Allevents.length > 0 ? (
                        Allevents.map((item) => (
                            <tr key={item._id} className="text-center">
                                <td className="p-2 border">{item.eventName}</td>
                                <td className="p-2 border">{item.organizarName}</td>
                                <td className="p-2 border">{item.discription}</td>
                                <td className="p-2 border">{item.date}</td>
                                <td className="p-2 border">{item.time}</td>
                                <td className="p-2 border">{item.venue}</td>
                                <td className="p-2 border">{item.status || 'Pending'}</td>
                                <td className="p-2 border">
                                    <button
                                        className="px-4 py-2 rounded-lg font-semibold focus:outline-none bg-blue-500 text-white hover:bg-blue-600 mr-2"
                                        onClick={() => updateStatus(item._id, 'Approved')}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-lg font-semibold focus:outline-none bg-red-500 text-white hover:bg-red-600"
                                        onClick={() => updateStatus(item._id, 'Rejected')}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center">No events found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EventCoPage;
