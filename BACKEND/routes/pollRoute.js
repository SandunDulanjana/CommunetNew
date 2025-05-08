import express from "express";
import {
  getAllPolls,
  createPoll,
  deletePoll,
  updatePoll,
  votePoll,
  closePoll,
  getPollById
} from "../controllers/pollController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

const router = express.Router();

// Get all polls
router.get("/", getAllPolls);

//get single polls
router.get("/:id", getPollById);

// Create a poll
router.post("/", createPoll);

// Delete a poll
router.delete("/:id", deletePoll);

// Update a poll
router.put("/:id", updatePoll);

// Vote for a poll
router.post("/:id/vote", authenticateUser, votePoll);

// Close a poll
router.put("/:id/close", closePoll);

export default router;
