import express from "express";
import { displayMember,updateMember,changePassword} from "../controllers/ProfileController.js";
import upload from "../middlewares/multer.js";
import { authenticateUser } from '../middlewares/authenticateUser.js';

const ProfileRouter = express.Router();

ProfileRouter.get('/displayMember', displayMember);
ProfileRouter.put('/updateMember', upload.single('image'), updateMember);
ProfileRouter.put('/change-password', authenticateUser, changePassword);

export default ProfileRouter;