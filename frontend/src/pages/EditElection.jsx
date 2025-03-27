import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditElection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/poll/${id}`);
        setQuestion(response.data.question);
        setOptions(response.data.options);
      } catch (error) {
        console.error("Error fetching poll data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  const handleOptionChange = (index, event) => {
    const newOptions = [...options];
    newOptions[index].optionText = event.target.value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { optionText: "" }]);
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/poll/${id}`, {
        question,
        options,
      });
      navigate("/ElectionCoPage");
    } catch (error) {
      console.error("Error updating poll:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Poll</h2>
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
          Update Poll
        </button>
      </form>
    </div>
  );
};

export default EditElection;
