import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ElectionCoPage = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/poll/");
        setPolls(response.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPolls();
  }, []);

  const deletePoll = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/poll/${id}`);
      setPolls((prevPolls) => prevPolls.filter((poll) => poll._id !== id));
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Polls</h2>
      <Link to="/addElection" className="bg-blue-500 text-white p-2 rounded">
        Add Poll
      </Link>
      <ul>
        {polls.length > 0 ? (
          polls.map((poll) => (
            <li key={poll._id} className="flex justify-between p-2 border-b">
              <span>{poll.question}</span>
              <div>
                <Link to={`/EditElection/${poll._id}`} className="mr-2 text-yellow-500">
                  Edit
                </Link>
                <button
                  onClick={() => deletePoll(poll._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No polls available</li>
        )}
      </ul>
    </div>
  );
};

export default ElectionCoPage;
