import express from 'express'
import {registerUser, loginUser} from "../controllers/UserController.js"
import { authenticateUser } from '../../BACKEND/middlewares/authenticateUser.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

export default userRouter;