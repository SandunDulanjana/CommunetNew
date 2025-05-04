import TiketModel from "../models/TiketModel.js";
import Notification from "../models/notificationModel.js";
import nodemailer from 'nodemailer';

// Create a new ticket
const createTiket = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        // Stricter email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        const newTiket = new TiketModel({ name, email, subject, message });
        await newTiket.save();
        res.status(201).json({ success: true, message: "Ticket submitted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all tickets
const getAllTikets = async (req, res) => {
    try {
        const tikets = await TiketModel.find().sort({ date: -1 });
        res.status(200).json({ success: true, tikets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a ticket by ID
const getTiketById = async (req, res) => {
    try {
        const tiket = await TiketModel.findById(req.params.id);
        if (!tiket) return res.status(404).json({ success: false, message: "Ticket not found" });
        res.status(200).json({ success: true, tiket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a ticket
const deleteTiket = async (req, res) => {
    try {
        await TiketModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Ticket deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Reply to a ticket and notify the user
const replyToTiket = async (req, res) => {
    try {
        const { reply } = req.body;
        const tiketId = req.params.id;

        if (!reply) {
            return res.status(400).json({ success: false, message: "Reply is required" });
        }

        // Update the ticket with the reply
        const tiket = await TiketModel.findByIdAndUpdate(
            tiketId,
            { reply },
            { new: true }
        );
        if (!tiket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        // Send email to the user
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: tiket.email,
            subject: `Reply to your ticket: ${tiket.subject}`,
            text: `Dear ${tiket.name},\n\nThank you for contacting us. Here is our reply to your ticket:\n\n${reply}\n\nBest regards,\nSupport Team`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Reply sent and email notification delivered", tiket });
    } catch (error) {
        console.error("Error in replyToTiket:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    createTiket,
    getAllTikets,
    getTiketById,
    deleteTiket,
    replyToTiket
};
