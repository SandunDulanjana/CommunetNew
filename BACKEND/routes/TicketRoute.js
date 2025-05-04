import express from "express";
import { createTiket, getAllTikets, getTiketById, deleteTiket, replyToTiket } from "../controllers/TiketController.js";

const router = express.Router();


router.post("/", createTiket);

// Get all tickets
router.get("/", getAllTikets);

// Get a ticket by ID
router.get("/:id", getTiketById);

// Delete a ticket by ID
router.delete("/:id", deleteTiket);

// Reply to a ticket
router.post("/:id/reply", replyToTiket);

export default router;
