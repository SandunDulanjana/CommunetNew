import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../componenets/Footer";
import axios from "axios";

const MyMaintenance = () => {
  const navigate = useNavigate();
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/maintenance/MaintenanceRequest/67e51f88e522f26b95fa12d1"
        );
        console.log("Response:", response);

        if (response.data.success) {
          setMaintenance(response.data.maintenanceRequest);
        } else {
          setError(response.data.message || "Failed to fetch data.");
        }
      } catch (error) {
        console.error("Error fetching maintenance:", error);
        setError("Failed to load maintenance data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, []);

  const handleEdit = (id) => {
    navigate(`/EditMaintenance/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this maintenance request?"
      );
      if (confirmDelete) {
        await axios.delete(
          `http://localhost:5000/api/maintenance/DeleteMaintenanceRequest/${id}`
        );
        alert("Maintenance request deleted successfully");
        navigate("/"); // Redirect to home or maintenance list page
      }
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      alert("Failed to delete maintenance request. Try again later.");
    }
  };

  if (loading) {
    return <div className="text-center text-xl p-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-lg p-10">{error}</div>;
  }

  return (
    <div>
      <div className="flex flex-col min-h-screen p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Maintenance Details</h1>
          <button
            onClick={() => navigate("/AddMaintenance")}
            className="bg-blue-500 text-white px-6 py-2 rounded-2xl shadow-lg hover:bg-blue-600 transition"
          >
            Add Maintenance
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">House Owner</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">House No.</th>
                <th className="p-2 border">Maintenance Type</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Priority</th>
                <th className="p-2 border">Image</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100">
                <td className="p-2 border">{maintenance?.name || "N/A"}</td>
                <td className="p-2 border">{maintenance?.phone || "N/A"}</td>
                <td className="p-2 border">{maintenance?.email || "N/A"}</td>
                <td className="p-2 border">{maintenance?.houseNo || "N/A"}</td>
                <td className="p-2 border">{maintenance?.category || "N/A"}</td>
                <td className="p-2 border">{maintenance?.details || "N/A"}</td>
                <td className="p-2 border">{maintenance?.priority || "N/A"}</td>
                <td className="p-2 border">
                  {maintenance?.images ? (
                    <img
                      src={maintenance.images}
                      alt="Maintenance"
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => (e.target.src = "/default-image.png")}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleEdit(maintenance._id)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(maintenance._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MyMaintenance;
