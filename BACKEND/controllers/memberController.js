import jwt from 'jsonwebtoken';
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import memberModel from "../models/memberModel.js";
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// API for adding user data
const addMember = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    const { name, email, password, houseNO, phoneNumber, gender, NIC, memberType } = req.body;
    const imageFile = req.file;

    // Check if all required data is present
    if (!name || !email || !password || !houseNO || !phoneNumber || !gender || !NIC || !memberType) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password
    if (password.length < 8) {
      return res.json({ success: false, message: "Password is too short. It must be at least 8 characters." });
    }

    // Hashing member password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create member data
    const memberData = {
      name,
      email,
      password: hashedPassword,
      houseNO,
      phoneNumber,
      gender,
      NIC,
      memberType
    };

    // Create new member in the database
    const newMember = new memberModel(memberData);
    await newMember.save();

    // Return success message with member data (excluding password)
    res.json({
      success: true,
      message: "Registration successful",
      member: {
        name,
        email,
        houseNO,
        phoneNumber,
        gender,
        NIC,
        memberType
      },
    });

  } catch (error) {
    console.log("Error in addMember:", error);
    res.json({ success: false, message: error.message });
  }
};

// Display all members
const displayAllMembers = async (req, res) => {
  try {
    const AllMembers = await memberModel.find();
    return res.status(200).json({ success: true, AllMembers });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


  
// Delete member
const deleteMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    await memberModel.findByIdAndDelete(memberId);
    return res.json({ success: true, message: "Member details deleted successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Update member by admin
const updateAdminMember = async (req, res) => {
  try {
    const memberId = req.params.id;
    const { name, email, houseNO, phoneNumber, gender, NIC, memberType } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (!name || !email || !houseNO || !phoneNumber || !memberType || !gender || !NIC) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Construct update object
    const updateData = {
      name,
      email,
      houseNO,
      phoneNumber,
      gender,
      NIC,
      memberType
    };

    // Update member details in DB
    await memberModel.findByIdAndUpdate(memberId, { $set: updateData });

    return res.json({ success: true, message: "Member details updated successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export { displayAllMembers, addMember, deleteMember, updateAdminMember };
