import Poll from "../models/pollModel.js";
import mongoose from "mongoose";

// Get all polls
export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a poll
export const createPoll = async (req, res) => {
  const { question, options, creator } = req.body;
  
  if (!creator) {
    return res.status(400).json({ message: "Creator ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(creator)) {
    return res.status(400).json({ message: "Invalid creator ID format" });
  }

  try {
    const newPoll = new Poll({ question, options, creator });
    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (err) {
    console.error("Error creating poll:", err);
    res.status(400).json({ 
      message: err.message,
      details: err.errors ? Object.values(err.errors).map(e => e.message) : []
    });
  }
};

// Delete a poll
export const deletePoll = async (req, res) => {
  try {
    await Poll.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ message: "Poll not found" });
  }
};

// Update a poll
export const updatePoll = async (req, res) => {
  const { question, options, closed } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required" });
  }

  try {
    const updatedPoll = await Poll.findByIdAndUpdate(
      req.params.id,
      { 
        question: question,
        options: options,
        closed: closed 
      },
      { new: true, runValidators: true }
    );

    if (!updatedPoll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    res.json(updatedPoll);
  } catch (err) {
    console.error("Error updating poll:", err);
    res.status(400).json({ 
      message: err.message,
      details: err.errors ? Object.values(err.errors).map(e => e.message) : []
    });
  }
};

// Vote for a poll
export const votePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    const { optionIndex, userId } = req.body;

    // Log for debugging
    console.log('Poll ID:', req.params.id);
    console.log('Option Index:', optionIndex);
    console.log('User ID:', userId);

    // Ensure the optionIndex is within bounds
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option index." });
    }

    if (poll) {
      if (poll.voters.includes(userId)) {
        return res.status(400).json({ message: "You have already voted." });
      }
      
      // Update the poll
      poll.options[optionIndex].votes += 1;
      poll.voters.push(userId);
      
      // Save the updated poll
      await poll.save();
      
      res.json(poll);
    } else {
      return res.status(404).json({ message: "Poll not found" });
    }
  } catch (err) {
    console.error("Error voting on poll:", err); 
    res.status(500).json({ message: err.message });
  }
};
 

// Close a poll
export const closePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(req.params.id, { closed: true }, { new: true });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPollById = async (req, res) => {
    try {
      const poll = await Poll.findById(req.params.id);
      if (!poll) {
        return res.status(404).json({ message: "Poll not found" });
      }
      res.json(poll);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
