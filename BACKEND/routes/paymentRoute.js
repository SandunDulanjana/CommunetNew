import express from "express";
import Payment from "../models/PaymentModel.js"; // Create a Payment model
import { updatePaymentStatus } from "../controllers/paymentController.js";

const router = express.Router();

// Save payment details
router.post("/save", async (req, res) => {
  const { name, email, planId, amount, date } = req.body;

  try {
    const payment = new Payment({ name, email, planId, amount, date });
    await payment.save();
    res.status(201).json({ message: "Payment details saved successfully!" });
  } catch (error) {
    console.error("Error saving payment details:", error);
    res.status(500).json({ message: "Failed to save payment details." });
  }
});

// Get all payment details
router.get("/all", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ message: "Failed to fetch payment details." });
  }
});

// Get payments by user email
router.get("/user/:email", async (req, res) => {
  try {
    const payments = await Payment.find({ email: req.params.email });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ message: "Failed to fetch user payments." });
  }
});

// Update payment status
router.post("/update-status", updatePaymentStatus);

export default router;