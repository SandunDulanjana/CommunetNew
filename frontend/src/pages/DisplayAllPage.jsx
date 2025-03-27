import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/hoaDashboard.css";
import { Link } from "react-router-dom";

export default function HOACommunicationDashboard() {
    const [announcements, setAnnouncements] = useState([]);
    const [error, setError] = useState("");

    // Fetch announcements from the backend
    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/annoucement/annoucements");
            console.log("Fetched Announcements:", response.data.AllAnnouncements); // Debugging
            setAnnouncements(response.data.AllAnnouncements || []);
        } catch (error) {
            console.error("Error fetching announcements:", error);
            setError("Failed to load announcements. Please check the server or API endpoint.");
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // Handle delete announcement
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/displayAnnoucemnt/3`);

                setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
            } catch (error) {
                console.error("Error deleting announcement:", error);
            }
        }
    };

    return (
        <div className="container">
            <h1 className="title">H.O.A Communication Management</h1>

            <div className="search-add">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by author, type, or date..."
                />
            </div>

            <div className="card">
                <div className="card-body">
                    {error && <p className="error-message">{error}</p>}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Audience</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {announcements.length > 0 ? (
                                announcements.map((announcement) => (
                                    <tr key={announcement._id}>
                                        <td>{announcement.Type}</td>
                                        <td>{announcement.description}</td>
                                        <td>{new Date(announcement.date).toLocaleDateString()}</td>
                                        <td>{announcement.audience}</td>
                                        <td>
                                            <Link
                                                to={`/update-announcement/${announcement._id}`}
                                                className="edit-btn"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(announcement._id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        No Announcements Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
