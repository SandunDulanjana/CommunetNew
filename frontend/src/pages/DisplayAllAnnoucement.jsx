import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const DisplayAllAnnoucement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchAnnouncements = () => {
        setLoading(true);
        axios.get('http://localhost:5000/api/announcement/announcements')
            .then(data => {
                if (data.data.success) {
                    setAnnouncements(data.data.AllAnnoucemnts);
                    setError('');
                } else {
                    setError('Failed to load announcements. Please try again later.');
                }
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load announcements. Please try again later.');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        const res = await fetch(`http://localhost:5000/api/announcement/deleteAnnoucement/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
            fetchAnnouncements();
        } else {
            alert('Failed to delete announcement.');
        }
    };

    const filtered = announcements.filter(a => {
        const matchesType = typeFilter === 'All' || a.Type === typeFilter;
        const formattedDate = new Date(a.date).toLocaleDateString();
        const matchesSearch =
            a.Type.toLowerCase().includes(search.toLowerCase()) ||
            a.discription.toLowerCase().includes(search.toLowerCase()) ||
            a.audience.toLowerCase().includes(search.toLowerCase()) ||
            formattedDate.includes(search) ||
            a.audience.toLowerCase().replace(' block', '') === search.toLowerCase().replace(' block', '');
        return matchesType && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-2">
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
                        <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/addannoucement')}>New Announcement</span>
                        <span className="border-b-2 border-indigo-600 pb-1 cursor-pointer">All Announcements</span>
                        <span className="text-gray-500 hover:text-indigo-600 cursor-pointer" onClick={() => navigate('/ticket')}>Ticket</span>
                    </div>
                </div>
            </div>
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">All Announcements</h1>
                    <p className="text-gray-600 text-lg">Browse, search, update, or delete community announcements.</p>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2">
                    <input
                        type="text"
                        className="border border-indigo-200 focus:border-indigo-500 px-4 py-2 rounded-lg w-full md:w-1/2 shadow-sm"
                        placeholder="🔍 Search announcements..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <select
                        className="border border-indigo-200 focus:border-indigo-500 px-4 py-2 rounded-lg w-full md:w-48 shadow-sm"
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                    >
                        <option value="All">All Types</option>
                        <option value="Emergency Notices">Emergency Notices</option>
                        <option value="Maintenance Updates">Maintenance Updates</option>
                        <option value="General Announcements">General Announcements</option>
                    </select>
                </div>
                {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
                <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                    <table className="min-w-full text-center">
                        <thead className="bg-indigo-100">
                            <tr>
                                <th className="py-3 px-4 font-semibold text-indigo-700">Type</th>
                                <th className="py-3 px-4 font-semibold text-indigo-700">Description</th>
                                <th className="py-3 px-4 font-semibold text-indigo-700">Date</th>
                                <th className="py-3 px-4 font-semibold text-indigo-700">Audience</th>
                                <th className="py-3 px-4 font-semibold text-indigo-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={5} className="py-8 text-gray-500">Loading...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="py-8 text-gray-400">No announcements found</td></tr>
                            ) : (
                                filtered.map(a => (
                                    <tr key={a._id} className="border-t hover:bg-indigo-50 transition">
                                        <td className="py-3 px-4">{a.Type}</td>
                                        <td className="py-3 px-4 text-left">{a.discription}</td>
                                        <td className="py-3 px-4">{new Date(a.date).toLocaleDateString()}</td>
                                        <td className="py-3 px-4">{a.audience}</td>
                                        <td className="py-3 px-4 flex flex-col md:flex-row gap-2 justify-center items-center">
                                            <button
                                                className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow transition"
                                                onClick={() => navigate(`/updateannoucement/${a._id}`)}
                                            >
                                                <span role="img" aria-label="edit">✏️</span> Update
                                            </button>
                                            <button
                                                className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow transition"
                                                onClick={() => handleDelete(a._id)}
                                            >
                                                <span role="img" aria-label="delete">🗑️</span> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DisplayAllAnnoucement;


