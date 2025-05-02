import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import Footer from '../componenets/Footer';

const Election = () => {
  const [polls, setPolls] = useState([]);
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/poll");
      setPolls(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setLoading(false);
    }
  };

  const votePoll = async (pollId, optionIndex) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to vote.");
      return;
    }

    if (votes[pollId]) {
      alert("You have already voted!");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/poll/${pollId}/vote`, {
        optionIndex,
        userId,
      });
      setVotes({ ...votes, [pollId]: true });
      setSelectedOptions({ ...selectedOptions, [pollId]: optionIndex });
      fetchPolls(); // Refresh the polls to show updated results
    } catch (error) {
      console.error("Error voting:", error);
      alert("Error submitting vote. Please try again.");
    }
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
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Elections</h1>
          <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Active Elections</h1>
              
              <div className="grid gap-6">
                {polls.length > 0 ? (
                  polls.map((poll) => (
                    <div key={poll._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">{poll.question}</h2>
                        
                        {poll.closed ? (
                          <div className="text-red-500 font-medium mb-4">This election is closed.</div>
                        ) : (
                          <div className="space-y-3 mb-6">
                            {poll.options.map((option, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                  selectedOptions[poll._id] === index
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                                onClick={() => !poll.closed && votePoll(poll._id, index)}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-700">{option.optionText}</span>
                                  <span className="text-gray-500">{option.votes} votes</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {votes[poll._id] ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Results</h3>
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
                              <h3 className="text-lg font-semibold mb-4">Distribution</h3>
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
                        ) : (
                          <div className="text-center text-blue-600 font-medium mt-6">
                            Please vote to see the results.
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600 text-lg">No active elections available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Election;