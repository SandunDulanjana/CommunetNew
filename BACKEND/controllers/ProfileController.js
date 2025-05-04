import memberModel from "../models/memberModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import validator from 'validator';  
import cloudinary from 'cloudinary';
import sendEmail from '../utils/sendEmail.js';
import Notification from '../models/notificationModel.js';
import twilio from 'twilio';
import sendSMS from '../utils/sendSMS.js';


// Load environment variables from .env file
dotenv.config();

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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
    if (!name  || !houseNO || !phoneNumber || !bio || !gender || !NIC) {
      return res.json({ success: false, message: "All fields are required" });
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
       <p>Your password was changed successfully. If this wasn't you, please contact support immediately.</p>
       <p><b>Communet App</b></p>`
    );

    res.status(200).json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Error in changePassword:", error.message); 
    res.status(500).json({ message: "Server error" });
  }
};

const updateEmail = async (req, res) => {
  try {
    const { currentEmail, newEmail } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    // Check if new email is already in use
    const existingUser = await memberModel.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Find user and verify current email
    const user = await memberModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.email !== currentEmail) {
      return res.status(400).json({ success: false, message: 'Current email is incorrect' });
    }

    // Update email
    user.email = newEmail;
    await user.save();

    // Create notification for email update
    const notification = new Notification({
      userId: userId,
      title: 'Email Update',
      message: 'Your email has been successfully updated',
      type: 'email_update'
    });
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Email updated successfully',
      updatedMember: user
    });

  } catch (error) {
    console.error('Email update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update email' });
  }
};

// Send OTP for two-step verification
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    /*console.log('Processing OTP request for user:', {
      userId,
      email: decoded.email,
      phone
    });*/

    // Validate phone number format (Sri Lankan format)
    const phoneRegex = /^(?:\+94|0)?[1-9][0-9]{8}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number format. Please enter a valid Sri Lankan phone number (e.g., 0771234567 or +94771234567)' 
      });
    }

    // Format phone number to standard format
    let formattedPhone = phone;
    if (phone.startsWith('0')) {
      formattedPhone = '+94' + phone.substring(1);
    } else if (!phone.startsWith('+94')) {
      formattedPhone = '+94' + phone;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    /*console.log('Generated OTP:', {
      otp,
      formattedPhone,
      expiry: new Date(Date.now() + 5 * 60 * 1000)
    });*/

    // First, find the user to check if they exist
    const user = await memberModel.findById(userId);
    if (!user) {
      console.error('User not found:', userId);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user's twoFactorAuth field
    user.twoFactorAuth = {
      phone: formattedPhone,
      otp,
      otpExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      isEnabled: false
    };

    // Save the updated user document
    await user.save();

    /*console.log('Updated user document:', {
      userId: user._id,
      email: user.email,
      twoFactorAuth: user.twoFactorAuth
    });*/

    try {
      // Send OTP via SMS
      const message = `Your Communet verification code is: ${otp}. This code will expire in 5 minutes.`;
      await sendSMS(formattedPhone, message);

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your phone'
      });
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      // For development, still return success with OTP
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        otp: otp, // This will be removed in production
        debug: {
          phone: formattedPhone,
          expiry: new Date(Date.now() + 5 * 60 * 1000),
          userId: user._id,
          smsError: smsError.message
        }
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Verify OTP for two-step verification
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    /*console.log('Verifying OTP for user:', {
      userId,
      email: decoded.email,
      phone,
      otp
    });*/

    const user = await memberModel.findById(userId);
    if (!user) {
      console.error('User not found during verification:', userId);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log('User two-factor auth data:', {
      userId: user._id,
      twoFactorAuth: user.twoFactorAuth
    });

    // Check if OTP exists and is not expired
    if (!user.twoFactorAuth || !user.twoFactorAuth.otp || !user.twoFactorAuth.otpExpiry) {
      console.error('No OTP found or OTP expired for user:', userId);
      return res.status(400).json({ success: false, message: 'No OTP found or OTP expired' });
    }

    if (new Date() > user.twoFactorAuth.otpExpiry) {
      console.error('OTP expired for user:', userId);
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    if (user.twoFactorAuth.otp !== otp) {
      console.error('Invalid OTP for user:', userId);
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Update user's two-factor authentication status
    user.twoFactorAuth = {
      ...user.twoFactorAuth,
      isEnabled: true,
      otp: null,
      otpExpiry: null
    };
    await user.save();

    console.log('Successfully enabled 2FA for user:', {
      userId: user._id,
      email: user.email
    });

    // Create notification for successful 2FA setup
    const notification = new Notification({
      userId: userId,
      title: 'Two-Factor Authentication',
      message: 'Two-factor authentication has been successfully enabled for your account',
      type: 'system'
    });
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication enabled successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};

// Verify password before deletion
const verifyDeletePassword = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const memberId = decoded.id;

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const member = await memberModel.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Password verified successfully" 
    });

  } catch (error) {
    console.error("Error in verifyDeletePassword:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete account
const deleteAccount = async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const memberId = decoded.id;

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const member = await memberModel.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    // Send farewell email before deletion
    await sendEmail(
      member.email,
      "Account Deletion Confirmation",
      `<h3>Goodbye ${member.name},</h3>
       <p>Your account has been successfully deleted from Communet.</p>
       <p>We're sorry to see you go. If you change your mind, you can always create a new account.</p>
       <p><b>Communet Team</b></p>`
    );

    // Delete the member
    await memberModel.findByIdAndDelete(memberId);

    res.status(200).json({ 
      success: true, 
      message: "Account deleted successfully" 
    });

  } catch (error) {
    console.error("Error in deleteAccount:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { 
  displayMember, 
  updateMember, 
  changePassword, 
  updateEmail,
  sendOTP,
  verifyOTP,
  verifyDeletePassword,
  deleteAccount 
};
