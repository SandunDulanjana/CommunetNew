import validator from "validator";
import bcrypt from "bcrypt";
import memberModel from "../models/memberModel.js";
import jwt from 'jsonwebtoken';
import express from 'express'
import nodemailer from 'nodemailer';

// API for user registration
const registerUser = async (req, res) => {
  try {
    const { houseNO, email, password } = req.body;
    
    // Check for missing fields
    if (!houseNO || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    
    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }
    
    // Validate password length
    if (password.length < 8) {
      return res.json({ success: false, message: "Password is too short. It must be at least 8 characters." });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      houseNO,
      email,
      password: hashedPassword,
      memberType: 'member',
      date: Date.now(),
    };

    const newUser = await new memberModel(user).save();

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await memberModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);

      res.json({ 
        success: true, 
        token,
        memberType: user.memberType,
        email: user.email 
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Generate a random 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store verification codes (in production, use Redis or a database)
const verificationCodes = new Map();

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send verification code
const sendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists
        const user = await memberModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "No account found with this email" });
        }

        // Generate and store verification code
        const code = generateVerificationCode();
        verificationCodes.set(email, {
            code,
            timestamp: Date.now()
        });

        // Send email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Verification Code',
            text: `Your verification code is: ${code}. This code will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Verification code sent to your email" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify code
const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;
        
        const storedData = verificationCodes.get(email);
        if (!storedData) {
            return res.json({ success: false, message: "No verification code found" });
        }

        // Check if code is expired (10 minutes)
        if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
            verificationCodes.delete(email);
            return res.json({ success: false, message: "Verification code expired" });
        }

        if (storedData.code !== code) {
            return res.json({ success: false, message: "Invalid verification code" });
        }

        // Code is valid
        verificationCodes.delete(email);
        res.json({ success: true, message: "Code verified successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate password
        if (password.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters long" });
        }

        // Find user and update password
        const user = await memberModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Changed Successfully',
            text: 'Your password has been changed successfully. If you did not make this change, please contact support immediately.'
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { registerUser, loginUser, sendVerificationCode, verifyCode, resetPassword };
