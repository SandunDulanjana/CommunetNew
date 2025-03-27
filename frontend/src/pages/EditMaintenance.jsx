import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditMaintenance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState({
    name: '',
    phone: '',
    email: '',
    houseNo: '',
    category: '',
    details: '',
    priority: '',
    images: [],
  });
  const [selectedImages, setSelectedImages] = useState([]);

  // Fetch maintenance request details
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/maintenance/MaintainanceRequest/${id}`);
        setMaintenance(response.data.MaintainanceRequest);
      } catch (error) {
        console.error('Error fetching maintenance:', error);
      }
    };

    fetchMaintenance();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaintenance((prevMaintenance) => ({
      ...prevMaintenance,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setSelectedImages([...e.target.files]); // Store selected files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();

      Object.keys(maintenance).forEach((key) => {
        formDataObj.append(key, maintenance[key]);
      });

      // Append selected images to FormData
      // Array.from(selectedImages).forEach((file) => {
      //   maintenance.append('images', file);
      // });

      // Make the PUT request to update the maintenance request
      const { data } = await axios.put(
        `http://localhost:5000/api/maintenance/UpdateMaintainanceRequest/${id}`,
        formDataObj,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (data.success) {
        alert('Maintenance request updated successfully');
        // setFormData({
        //   name: "",
        //   phone: "",
        //   email: "",
        //   houseNo: "",
        //   category: "",
        //   details: "",
        //   priority: "",
        //   images: null,
        // });
      } else {
        alert(`Failed to submit request: ${data.message}`);
      }


      navigate('/');
    } catch (error) {
      console.error('Error updating maintenance:', error.response?.data || error.message);
      alert('Error updating maintenance request');
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Maintenance Request</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">House Owner Name:</label>
            <input
              type="text"
              name="name"
              value={maintenance.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block">Phone:</label>
            <input
              type="text"
              name="phone"
              value={maintenance.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block">Email:</label>
            <input
              type="email"
              name="email"
              value={maintenance.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block">House Number:</label>
            <input
              type="text"
              name="houseNo"
              value={maintenance.houseNo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Maintenance Type (Dropdown) */}
          <div className="mb-4">
            <label className="block">Maintenance Type:</label>
            <select
              name="category"
              value={maintenance.category}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">Select Maintenance Type</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Carpentry">Carpentry</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block">Description:</label>
            <textarea
              name="details"
              value={maintenance.details}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Priority (Radio Buttons with space) */}
          <div className="mb-4">
            <label className="block">Priority:</label>
            <div className="flex space-x-4">
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={maintenance.priority === 'Low'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Low
              </label>

              <label>
                <input
                  type="radio"
                  name="priority"
                  value="Medium"
                  checked={maintenance.priority === 'Medium'}
                  onChange={handleChange}
                  className="mr-2"
                />
                Medium
              </label>

              <label>
                <input
                  type="radio"
                  name="priority"
                  value="High"
                  checked={maintenance.priority === 'High'}
                  onChange={handleChange}
                  className="mr-2"
                />
                High
              </label>
            </div>
          </div>



          {/* Image Upload */}
          <div className="mb-4">
            <label className="block">Upload Images:</label>
            <input
              type="file"
              name="images"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-lg hover:bg-blue-600 transition w-full"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMaintenance;