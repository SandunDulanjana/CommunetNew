import validator from "validator";
import bcrypt from "bcrypt";
import memberModel from "../models/memberModel.js";
import jwt from 'jsonwebtoken';
import express from 'express'

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

export { registerUser, loginUser };
