import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const ElectionCoPage = () => {
  const [polls, setPolls] = useState([]);
  const [expandedPoll, setExpandedPoll] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/poll/");
      setPolls(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setLoading(false);
    }
  };

  const deletePoll = async (id) => {
    if (window.confirm("Are you sure you want to delete this election?")) {
      try {
        await axios.delete(`http://localhost:5000/api/poll/${id}`);
        setPolls((prevPolls) => prevPolls.filter((poll) => poll._id !== id));
      } catch (error) {
        console.error("Error deleting poll:", error);
      }
    }
  };

  const closePoll = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/poll/${id}/close`);
      fetchPolls(); // Refresh the polls list
    } catch (error) {
      console.error("Error closing poll:", error);
    }
  };

  const toggleExpand = (pollId) => {
    setExpandedPoll(expandedPoll === pollId ? null : pollId);
  };

  const prepareChartData = (poll) => {
    return poll.options.map((option, index) => ({
      name: option.optionText,
      value: option.votes,
      color: COLORS[index % COLORS.length]
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Election Management</h1>
          <Link
            to="/addElection"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Election
          </Link>
        </div>

        <div className="grid gap-6">
          {polls.length > 0 ? (
            polls.map((poll) => (
              <div
                key={poll._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(poll._id)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{poll.question}</h2>
                      <p className="text-gray-600 mt-1">
                        Total Votes: {poll.voters.length}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/EditElection/${poll._id}`}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-200"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePoll(poll._id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                      >
                        Delete
                      </button>
                      {!poll.closed && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closePoll(poll._id);
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {expandedPoll === poll._id && (
                  <div className="border-t border-gray-200 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Bar Chart Results</h3>
                        <BarChart width={400} height={300} data={prepareChartData(poll)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Pie Chart Results</h3>
                        <PieChart width={400} height={300}>
                          <Pie
                            data={prepareChartData(poll)}
                            cx={200}
                            cy={150}
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          >
                            {prepareChartData(poll).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">No elections available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElectionCoPage;
