import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateAddAnnoucement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [audience, setAudience] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch the announcement by ID
        fetch(`http://localhost:5000/api/announcement/announcements`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const ann = data.AllAnnoucemnts.find(a => a._id === id);
                    if (ann) {
                        setType(ann.Type);
                        setDescription(ann.discription);
                        setAudience(ann.audience);
                    } else {
                        setMessage('Announcement not found.');
                    }
                } else {
                    setMessage('Failed to load announcement.');
                }
                setLoading(false);
            })
            .catch(() => {
                setMessage('Failed to load announcement.');
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch(`http://localhost:5000/api/announcement/updateAnnoucement/${id}`, {
                method: 'PUT',
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
                setMessage('Announcement updated successfully!');
                setTimeout(() => navigate('/displayallannoucement'), 1000);
            } else {
                setMessage(data.message || 'Failed to update announcement.');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">
                <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Update Announcement</h1>
                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2 font-semibold">Announcement Type</label>
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={type}
                                onChange={e => setType(e.target.value)}
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
                                onChange={e => setDescription(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold">Target Audience</label>
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={audience}
                                onChange={e => setAudience(e.target.value)}
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
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 text-lg"
                        >
                            Update Announcement
                        </button>
                        {message && <div className="mt-4 text-center text-red-500">{message}</div>}
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateAddAnnoucement;