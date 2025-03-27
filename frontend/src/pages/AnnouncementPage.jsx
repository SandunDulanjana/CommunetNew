import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


const AnnouncementPage = () => {
    const [announcement, setAnnouncement] = useState({
        Type: "",
        description: "",
        date: "",
        audience: "",
    });
    const navigate = useNavigate(); // Initialize the navigate function

    const handleChange = (e) => {
        setAnnouncement({ ...announcement, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        alert(
            `Type: ${announcement.Type}\nDescription: ${announcement.description}\nDate: ${announcement.date}\nAudience: ${announcement.audience}`
        );

        try {
            const { data } = await axios.post(
                'http://localhost:5000/api/annoucement/addannoucemnt',
                announcement,
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log('Response:', data);
            setAnnouncement({ Type: "", description: "", date: "", audience: "" });
            navigate("/DisplayAllPage");
        } catch (error) {
            console.error("Error submitting announcement:", error);
        }
    };


    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add New Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <input
                        type="text"
                        name="Type"
                        value={announcement.Type}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter type"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={announcement.description}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter description"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={announcement.date}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Audience</label>
                    <input
                        type="text"
                        name="audience"
                        value={announcement.audience}
                        onChange={handleChange}
                        required
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter audience"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Submit Announcement
                </button>
            </form>
        </div>
    );
};

export default AnnouncementPage;