import express from "express";
import { addMember, displayAllMembers, displayMember ,updateMember, deleteMember,updateAdminMember} from "../controllers/memberController.js";
import upload from "../middlewares/multer.js";


const memberRouter = express.Router();
memberRouter.post('/add-member',upload.single('image'),addMember)
memberRouter.get('/members', displayAllMembers)
memberRouter.get('/displayMember/:id', displayMember)
memberRouter.put('/updateMember/:id', updateMember)
memberRouter.delete('/deleteMember/:id', deleteMember)
memberRouter.put('/updateAdminMember/:id', updateAdminMember)
export default memberRouter;


