import express from "express";
import { displayMember, updateMember, changePassword, updateEmail, sendOTP, verifyOTP, verifyDeletePassword, deleteAccount } from "../controllers/ProfileController.js";
import upload from "../middlewares/multer.js";
import { authenticateUser } from '../middlewares/authenticateUser.js';

const ProfileRouter = express.Router();

ProfileRouter.get('/displayMember', displayMember);
ProfileRouter.put('/updateMember', upload.single('image'), updateMember);
ProfileRouter.put('/change-password', authenticateUser, changePassword);
ProfileRouter.put('/update-email', authenticateUser, updateEmail);
ProfileRouter.post('/send-otp', authenticateUser, sendOTP);
ProfileRouter.post('/verify-otp', authenticateUser, verifyOTP);
ProfileRouter.post('/verify-delete', authenticateUser, verifyDeletePassword);
ProfileRouter.delete('/delete', authenticateUser, deleteAccount);

export default ProfileRouter;


