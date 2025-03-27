import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddElection = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([{ optionText: "" }]);
  const navigate = useNavigate();

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index].optionText = event.target.value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { optionText: "" }]);
  };

  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pollData = {
      question,
      options,
    };

    await fetch("http://localhost:5000/api/poll/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pollData),
    });
    navigate("/ElectionCoPage"); // Redirect to the ElectionCoPage
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Add New Poll</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2 w-full mb-2"
          placeholder="Enter poll question"
          required
        />
        <div className="mb-2">
          {options.map((option, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={option.optionText}
                onChange={(e) => handleOptionChange(index, e)}
                className="border p-2 flex-1"
                placeholder={`Option ${index + 1}`}
                required
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="text-red-500 ml-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="bg-blue-500 text-white p-2 rounded mb-4"
          >
            Add Option
          </button>
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Create Poll
        </button>
      </form>
    </div>
  );
};

export default AddElection;
