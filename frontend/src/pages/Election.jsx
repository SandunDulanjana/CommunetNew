import React, { useEffect, useState } from "react";
import axios from "axios";

const Election = () => {
  const [polls, setPolls] = useState([]);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/poll");
        setPolls(response.data);
      } catch (error) {
        console.error("Error fetching polls:", error);
      }
    };
    fetchPolls();
  }, []);

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
    }catch (error) {
      console.error("Error fetching polls:", error);
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Vote on Polls</h2>
      <ul>
        {polls.map((poll) => (
          <li key={poll._id} className="p-4 border-b mb-4">
            <h3 className="font-bold">{poll.question}</h3>
            <div>
              {poll.options.map((option, index) => (
                <div key={index} className="mb-2">
                  <button
                    onClick={() => votePoll(poll._id, index)}
                    className="bg-blue-500 text-white p-2 rounded"
                    disabled={poll.closed}
                  >
                    {option.optionText} (Votes: {option.votes})
                  </button>
                </div>
              ))}
            </div>
            {poll.closed && <div className="text-red-500">This poll is closed.</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Election;