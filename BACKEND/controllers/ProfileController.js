import memberModel from "../models/memberModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import validator from 'validator';  
import cloudinary from 'cloudinary';
import sendEmail from '../utils/sendEmail.js';


// Load environment variables from .env file
dotenv.config();

// Display member profile
const displayMember = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Using the JWT_SECRET from environment variables
    const memberId = decoded.id;

    const Member = await memberModel.findById(memberId);
    return res.status(200).json({ success: true, Member });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update member profile
const updateMember = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const memberId = decoded.id;

    const { name, email, houseNO, phoneNumber, bio, gender, NIC } = req.body;
    const imageFile = req.file;

    // Validate required fields
    if (!name || !email || !houseNO || !phoneNumber || !bio || !gender || !NIC) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    let imageUrl;
    if (imageFile) {
      // Upload image to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      imageUrl = imageUpload.secure_url;
    }

    // Construct update object
    const updateData = {
      name,
      email,
      houseNO,
      phoneNumber,
      bio,
      gender,
      NIC,
    };

    // Add image URL only if a new image was uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updatedMember = await memberModel.findByIdAndUpdate(memberId, { $set: updateData }, { new: true });

    if (!updatedMember) {
      return res.json({ success: false, message: "Member not found" });
    }

    return res.json({
      success: true,
      message: "Member details updated successfully",
      updatedMember, // Send updated member data back to frontend
    });

  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const memberId = decoded.id;


    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const member = await memberModel.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, member.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    member.password = hashedPassword;

    await member.save();

    await sendEmail(
      member.email,
      "Password Changed Successfully",
      `<h3>Hello ${member.name},</h3>
       <p>Your password was changed successfully. If this wasn’t you, please contact support immediately.</p>
       <p><b>Communet App</b></p>`
    );

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Error in changePassword:", error.message); 
    res.status(500).json({ message: "Server error" });
  }
};

export { displayMember, updateMember, changePassword };
