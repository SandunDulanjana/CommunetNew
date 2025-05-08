import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../componenets/Footer';

const EventCoPage = () => {
    const [Allevents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectingEventId, setRejectingEventId] = useState(null);
    const [approvingEventId, setApprovingEventId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

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
    const updateStatus = async (id, status, reason = '') => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert('Please login to update event status');
                return;
            }

            // Find the event data from the current list
            const eventToUpdate = Allevents.find(event => event._id === id);
            if (!eventToUpdate) {
                alert('Event not found');
                return;
            }

            // Create update data with all event fields plus status and reason
            const updateData = {
                eventName: eventToUpdate.eventName,
                organizarName: eventToUpdate.organizarName,
                discription: eventToUpdate.discription,
                date: eventToUpdate.date,
                time: eventToUpdate.time,
                venue: eventToUpdate.venue,
                organizarContactNo: eventToUpdate.organizarContactNo,
                organizarEmail: eventToUpdate.organizarEmail,
                expectedCount: eventToUpdate.expectedCount,
                requestType: eventToUpdate.requestType,
                status: status,
                reason: reason
            };

            console.log('Sending update data:', updateData); // Debug log

            const response = await axios.put(
                `http://localhost:5000/api/event/update-event/${id}`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                alert(`Event ${status.toLowerCase()} successfully`);
                setAllEvents(Allevents.filter(event => event._id !== id));
            } else {
                alert(response.data.message || 'Failed to update event status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update event status. Please try again.');
        }
    };

    const handleApproveClick = (event) => {
        setSelectedEvent(event);
        setApprovingEventId(event._id);
        setShowApproveModal(true);
    };

    const handleApproveConfirm = async () => {
        try {
            setIsApproving(true);
            await updateStatus(approvingEventId, 'Approved');
            setShowApproveModal(false);
            setApprovingEventId(null);
            setSelectedEvent(null);
        } catch (error) {
            console.error('Error approving event:', error);
            alert('Failed to approve event. Please try again.');
        } finally {
            setIsApproving(false);
        }
    };

    const handleApproveCancel = () => {
        setShowApproveModal(false);
        setApprovingEventId(null);
        setSelectedEvent(null);
    };

    const handleRejectClick = (event) => {
        setSelectedEvent(event);
        setRejectingEventId(event._id);
        setShowRejectModal(true);
    };

    const handleRejectConfirm = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a reason for rejection.');
            return;
        }
        try {
            setIsRejecting(true);
            await updateStatus(rejectingEventId, 'Rejected', rejectionReason);
            setShowRejectModal(false);
            setRejectionReason('');
            setRejectingEventId(null);
            setSelectedEvent(null);
        } catch (error) {
            console.error('Error rejecting event:', error);
            alert('Failed to reject event. Please try again.');
        } finally {
            setIsRejecting(false);
        }
    };

    const handleRejectCancel = () => {
        setShowRejectModal(false);
        setRejectionReason('');
        setRejectingEventId(null);
        setSelectedEvent(null);
    };

    if (loading) return <div className="p-4">Loading events...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <div className="flex-grow p-6">
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
                                                onClick={() => handleApproveClick(item)}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="px-4 py-2 rounded-lg font-semibold focus:outline-none bg-red-500 text-white hover:bg-red-600"
                                                onClick={() => handleRejectClick(item)}
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

                {/* Approve Confirmation Modal */}
                {showApproveModal && selectedEvent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4 text-green-700">Approve Event</h2>
                            <div className="mb-4">
                                <p className="font-semibold">Event Details:</p>
                                <p>Name: {selectedEvent.eventName}</p>
                                <p>Organizer: {selectedEvent.organizarName}</p>
                                <p>Date: {selectedEvent.date}</p>
                                <p>Time: {selectedEvent.time}</p>
                                <p>Venue: {selectedEvent.venue}</p>
                            </div>
                            <p className="mb-4">Are you sure you want to approve this event?</p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleApproveCancel}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                    disabled={isApproving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleApproveConfirm}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                                    disabled={isApproving}
                                >
                                    {isApproving ? 'Approving...' : 'Confirm Approve'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reject Reason Modal */}
                {showRejectModal && selectedEvent && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4 text-red-700">Reject Event</h2>
                            <div className="mb-4">
                                <p className="font-semibold">Event Details:</p>
                                <p>Name: {selectedEvent.eventName}</p>
                                <p>Organizer: {selectedEvent.organizarName}</p>
                                <p>Date: {selectedEvent.date}</p>
                                <p>Time: {selectedEvent.time}</p>
                                <p>Venue: {selectedEvent.venue}</p>
                            </div>
                            <textarea
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                placeholder="Enter reason for rejection..."
                                className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
                                rows="4"
                                required
                                disabled={isRejecting}
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={handleRejectCancel}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                    disabled={isRejecting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRejectConfirm}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                                    disabled={!rejectionReason.trim() || isRejecting}
                                >
                                    {isRejecting ? 'Rejecting...' : 'Confirm Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default EventCoPage;
