import express from 'express'
import {registerUser, loginUser, sendVerificationCode, verifyCode, resetPassword} from "../controllers/UserController.js"
import { authenticateUser } from '../../BACKEND/middlewares/authenticateUser.js'

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/send-verification', sendVerificationCode)
userRouter.post('/verify-code', verifyCode)
userRouter.post('/reset-password', resetPassword)

export default userRouter;