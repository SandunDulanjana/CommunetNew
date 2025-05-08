import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import Footer from '../componenets/Footer';
import { motion } from 'framer-motion';
import electionHeroImg from '../assets/Elections.jpg';

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
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/poll");
      setPolls(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching polls:", error);
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to vote.");
      return;
    }

    if (votes[pollId]) {
      alert("You have already voted in this poll.");
      return;
    }

    try {
      // First verify the poll exists and check if it's closed
      const pollResponse = await axios.get(`http://localhost:5000/api/poll/${pollId}`);
      const poll = pollResponse.data;

      if (poll.closed) {
        alert("This poll is closed.");
        return;
      }

      // Send the vote request
      const response = await axios.post(
        `http://localhost:5000/api/poll/${pollId}/vote`,
        { optionIndex },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        // Update local state
        setVotes(prev => ({ ...prev, [pollId]: true }));
        setSelectedOptions(prev => ({ ...prev, [pollId]: optionIndex }));
        
        // Refresh the polls to show updated results
        await fetchPolls();
      }
      
    } catch (error) {
      console.error('Vote error:', error.response?.data || error.message);

      if (error.response?.status === 400) {
        if (error.response?.data?.message === 'You have already voted.') {
          setVotes(prev => ({ ...prev, [pollId]: true }));
          await fetchPolls();
          return;
        }
        alert(error.response.data.message || 'Error submitting vote');
      } else {
        alert('Error submitting vote. Please try again.');
      }
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[40vh] bg-blue-600">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src={electionHeroImg}
          alt="Community Elections"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Community Elections</h1>
            <p className="text-xl">Participate in community decisions and make your voice heard</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-16 mt-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Active Elections</h2>
            
            <div className="grid gap-8">
              {polls.length > 0 ? (
                polls.map((poll) => (
                  <motion.div
                    key={poll._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="p-8">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{poll.question}</h2>
                      
                      {poll.closed ? (
                        <div className="bg-red-50 text-red-600 font-medium p-4 rounded-lg mb-6">
                          This election is closed.
                        </div>
                      ) : (
                        <div className="space-y-4 mb-8">
                          {poll.options.map((option, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.02 }}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedOptions[poll._id] === index
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                              onClick={() => !poll.closed && handleVote(poll._id, index)}
                            >
                              <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-medium">{option.optionText}</span>
                                <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-sm">
                                  {option.votes} votes
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {votes[poll._id] ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                          <div className="bg-gray-50 p-6 rounded-xl">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Results</h3>
                            <BarChart width={400} height={300} data={prepareChartData(poll)}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                              <XAxis dataKey="name" stroke="#6b7280" />
                              <YAxis stroke="#6b7280" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white',
                                  borderRadius: '8px',
                                  border: 'none',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                              <Legend />
                              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </div>
                          <div className="bg-gray-50 p-6 rounded-xl">
                            <h3 className="text-xl font-semibold mb-6 text-gray-800">Distribution</h3>
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
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white',
                                  borderRadius: '8px',
                                  border: 'none',
                                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                              />
                              <Legend />
                            </PieChart>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 bg-blue-50 rounded-xl">
                          <p className="text-blue-600 font-medium">
                            Please vote to see the results
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16 bg-white rounded-2xl shadow-lg"
                >
                  <p className="text-gray-600 text-lg">No active elections available</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Election;