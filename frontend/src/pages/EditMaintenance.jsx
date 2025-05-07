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
    images: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  // Fetch maintenance request details
  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/maintenance/MaintenanceRequest/${id}`);
        const data = response.data.maintenanceRequest;
        setMaintenance(data);
        setCurrentImage(data.images || '');
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
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataObj = new FormData();

      // Add all maintenance data to FormData
      Object.keys(maintenance).forEach((key) => {
        if (key !== 'images') { // Don't append the old image URL
          formDataObj.append(key, maintenance[key]);
        }
      });

      // Append new image if selected
      if (selectedImage) {
        formDataObj.append('images', selectedImage);
      }

      console.log('Sending form data:', {
        name: maintenance.name,
        phone: maintenance.phone,
        email: maintenance.email,
        houseNo: maintenance.houseNo,
        category: maintenance.category,
        details: maintenance.details,
        priority: maintenance.priority,
        hasNewImage: !!selectedImage,
        currentImage: currentImage
      });

      // Make the PUT request to update the maintenance request
      const { data } = await axios.put(
        `http://localhost:5000/api/maintenance/UpdateMaintenanceRequest/${id}`,
        formDataObj,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (data.success) {
        alert('Maintenance request updated successfully');
        navigate('/MyMaintance');
      } else {
        alert(`Failed to submit request: ${data.message}`);
      }
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

          {/* Image Upload and Preview */}
          <div className="mb-4">
            <label className="block">Current Image:</label>
            {currentImage && (
              <div className="mt-2 mb-4">
                <img 
                  src={currentImage} 
                  alt="Current maintenance" 
                  className="w-32 h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-image.png';
                  }}
                />
              </div>
            )}
            <label className="block mt-2">Upload New Image:</label>
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
              accept="image/*"
            />
            {selectedImage && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">New image selected: {selectedImage.name}</p>
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  alt="Selected maintenance" 
                  className="w-32 h-32 object-cover rounded-lg mt-2"
                />
              </div>
            )}
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