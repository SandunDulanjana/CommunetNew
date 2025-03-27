// AddElection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddElection = () => {
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  const addPoll = async (e) => {
    e.preventDefault();
    await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });
    navigate("/");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add New Poll</h2>
      <form onSubmit={addPoll}>
        <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="border p-2 w-full mb-2" placeholder="Enter poll question" required />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Create Poll</button>
      </form>
    </div>
  );
};

export default AddElection;
