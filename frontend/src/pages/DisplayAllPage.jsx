import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/hoaDashboard.css"; // Import custom CSS
import { Link } from "react-router-dom";

export default function HOACommunicationDashboard() {
    const [announcements, setAnnouncements] = useState([]);

    // Fetch announcements from the backend
    const fetchAnnouncements = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/annoucements");
            console.log("Fetched Announcements:", response.data.AllAnnoucemnts); // Debugging
            setAnnouncements(response.data.AllAnnoucemnts);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []); // Empty dependency array means this will run once when the component mounts

    // Handle delete announcement
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/annoucements/${id}`); // Fixed string interpolation

                setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
            } catch (error) {
                console.error("Error deleting announcement:", error);
            }
        }
    };

    return (
        <div className="container">
            {/* Header */}
            <h1 className="title">H.O.A Communication Management</h1>

            {/* Search and Add Announcement */}
            <div className="search-add">
                <input type="text" className="search-input" placeholder="Search by author, type, or date..." />
            </div>

            {/* Announcements Table */}
            <div className="card">
                <div className="card-body">
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
                                        <td>{announcement.description}</td> {/* Fixed typo */}
                                        <td>{new Date(announcement.date).toLocaleDateString()}</td>
                                        <td>{announcement.audience}</td>
                                        <td>
                                            <Link to={`/update-announcement/${announcement._id}`} className="edit-btn"> {/* Fixed syntax */}
                                                Edit
                                            </Link>
                                            <button className="delete-btn" onClick={() => handleDelete(announcement._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>No Announcements Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}