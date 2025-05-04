import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAnnoucement = () => {
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [audience, setAudience] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch('http://localhost:5000/api/announcement/addAnnouncement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Type: type,
                    discription: description,
                    audience: audience,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage('Announcement added successfully!');
                setDescription('');
                setType('');
                setAudience('');
                setTimeout(() => navigate('/CommuniCoPage'), 1000);
            } else {
                setMessage(data.message || 'Failed to add announcement.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            {/* Header and Tabs */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="flex items-center mb-4">
                    <span className="text-2xl font-bold mr-4">
                        <span className="inline-flex items-center text-indigo-600">
                            <span className="mr-2">
                                <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M4 4h16v12H5.17L4 17.17V4z" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            Communication Center
                        </span>
                    </span>
                    <div className="ml-8 flex space-x-6 text-lg font-medium">
                        <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/CommuniCoPage')}>Dashboard</span>
                        <span className="border-b-2 border-indigo-600 pb-1 cursor-pointer">New Announcement</span>
                        <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/displayallannoucement')}>All Announcements</span>
                        <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/ticket')}>Ticket</span>
                    </div>
                </div>
            </div>
            <div className="text-center mb-8">
                <h1 className="text-5xl font-extrabold text-indigo-700 mb-2">Create Announcement</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Share Updates with Your Community</h2>
                <p className="text-gray-600">Keep your community informed with important announcements, updates, and news.</p>
            </div>
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Announcement Type</label>
                        <select
                            className="w-full border px-3 py-2 rounded"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="">Select a type</option>
                            <option value="Emergency Notices">Emergency Notices</option>
                            <option value="Maintenance Updates">Maintenance Updates</option>
                            <option value="General Announcements">General Announcements</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Description</label>
                        <textarea
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Enter detailed announcement description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-semibold">Target Audience</label>
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={audience}
                                onChange={(e) => setAudience(e.target.value)}
                                required
                            >
                                <option value="" disabled>Select audience</option>
                                <option value="A">A block</option>
                                <option value="B">B block</option>
                                <option value="C">C block</option>
                                <option value="D">D block</option>
                                <option value="All">All</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 text-lg"
                    >
                        Create Announcement
                    </button>
                </form>
                {message && <div className="mt-4 text-center text-red-500">{message}</div>}
            </div>
        </div>
    );
};

export default AddAnnoucement;
