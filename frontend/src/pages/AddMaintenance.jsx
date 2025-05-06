import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../componenets/Footer';

const AddMaintenance = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        houseNo: "",
        category: "",
        details: "",
        priority: "",
        images: null,
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Please log in to submit a maintenance request');
                    return;
                }

                const response = await axios.get(
                    'http://localhost:5000/api/ProfileRouter/displayMember',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    const member = response.data.Member;
                    setFormData(prev => ({
                        ...prev,
                        name: member.name || "",
                        phone: member.phoneNumber || "",
                        email: member.email || "",
                        houseNo: member.houseNO || ""
                    }));
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value, // Files are always in a list
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataObj = new FormData();
            Object.keys(formData).forEach((key) => {
                formDataObj.append(key, formData[key]);
            });

            const { data } = await axios.post(
                `http://localhost:5000/api/maintenance/add-requestform`,
                formDataObj,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (data.success) {
                alert("Maintenance request submitted successfully!");
                // Redirect to MyMaintenance page
                navigate('/MyMaintance');
            } else {
                alert(`Failed to submit request: ${data.message}`);
            }
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                <h1 className="text-3xl font-bold mb-8 text-center">Submit Maintenance Request</h1>

                <label className="block mb-4">
                    <span className="text-gray-700">Full Name:</span>
                    <input
                        name="name"
                        type="text"
                        onChange={handleChange}
                        value={formData.name}
                        required
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Phone Number:</span>
                    <input
                        name="phone"
                        type="text"
                        onChange={handleChange}
                        value={formData.phone}
                        required
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Email Address:</span>
                    <input
                        name="email"
                        type="email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">House Number:</span>
                    <input
                        name="houseNo"
                        type="text"
                        onChange={handleChange}
                        value={formData.houseNo}
                        required
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Issue Type:</span>
                    <select
                        name="category"
                        onChange={handleChange}
                        value={formData.category}
                        required
                        className="mt-1 p-2 w-full border rounded-md"
                    >
                        <option value="" disabled>Select issue type</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Carpentry">Carpentry</option>
                        <option value="Other">Other</option>
                    </select>
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Description:</span>
                    <textarea
                        name="details"
                        onChange={handleChange}
                        value={formData.details}
                        required
                        className="mt-1 p-2 w-full border rounded-md"
                    ></textarea>
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Priority:</span>
                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="priority"
                                value="Low"
                                checked={formData.priority === "Low"}
                                onChange={handleChange}
                                required
                            />
                            <span>Low</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="priority"
                                value="Medium"
                                checked={formData.priority === "Medium"}
                                onChange={handleChange}
                                required
                            />
                            <span>Medium</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="priority"
                                value="High"
                                checked={formData.priority === "High"}
                                onChange={handleChange}
                                required
                            />
                            <span>High</span>
                        </label>
                    </div>
                </label>

                <label className="block mb-4">
                    <span className="text-gray-700">Upload Images:</span>
                    <input
                        name="images"
                        type="file"
                        onChange={handleChange}
                        className="mt-1 p-2 w-full border rounded-md"
                    />
                </label>

                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700"
                >
                    Submit
                </button>
            </form>
            <Footer />
        </div>
    );
};

export default AddMaintenance;
