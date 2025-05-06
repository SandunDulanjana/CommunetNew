import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventCoPage = () => {
    const [Allevents, setAllEvents] = useState([]);

    // Fetch events from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/event/all-events');
                // Filter to show only pending events
                const pendingEvents = response.data.AllEvent.filter(event => !event.status || event.status === 'Pending');
                setAllEvents(pendingEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Update event status
    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert('Please login to update event status');
                return;
            }

            const response = await axios.put(
                `http://localhost:5000/api/event/update-event/${id}`,
                { status },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                alert(`Event ${status.toLowerCase()} successfully`);
                // Remove the event from the list after status update
                setAllEvents(Allevents.filter(event => event._id !== id));
            } else {
                alert(response.data.message || 'Failed to update event status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update event status. Please try again.');
        }
    };

    if (loading) return <div className="p-4">Loading events...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Event Approval Dashboard</h1>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-4 text-left">Event Name</th>
                            <th className="p-4 text-left">Organizer</th>
                            <th className="p-4 text-left">Description</th>
                            <th className="p-4 text-left">Date</th>
                            <th className="p-4 text-left">Time</th>
                            <th className="p-4 text-left">Venue</th>
                            <th className="p-4 text-left">Contact</th>
                            <th className="p-4 text-left">Email</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(Allevents) && Allevents.length > 0 ? (
                            Allevents.map((item) => (
                                <tr key={item._id} className="border-t hover:bg-gray-50">
                                    <td className="p-4">{item.eventName}</td>
                                    <td className="p-4">{item.organizarName}</td>
                                    <td className="p-4">{item.discription}</td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4">{item.time}</td>
                                    <td className="p-4">{item.venue}</td>
                                    <td className="p-4">{item.organizarContactNo}</td>
                                    <td className="p-4">{item.organizarEmail}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-sm ${
                                            item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                            item.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {item.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            className="px-4 py-2 rounded-lg font-semibold focus:outline-none bg-green-500 text-white hover:bg-green-600 mr-2"
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
                                <td colSpan="10" className="p-4 text-center text-gray-500">
                                    No pending events found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default EventCoPage;
