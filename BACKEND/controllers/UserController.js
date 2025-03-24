import validator from "validator";
import bcrypt from "bcrypt";
import memberModel from "../models/memberModel.js";
import jwt from 'jsonwebtoken';

//APT for user registation
const registerUser = async(req,res) =>{
    try{
        const {houseNO,email,Password} = req.body;
        if(!houseNO || !email || !Password){
            return res.json({ success: false, message: "Missing Details" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (Password.length < 8) {
            return res.json({ success: false, message: "Password is too short. It must be at least 8 characters." });
        }
        // Hashing member password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const user ={
            houseNO,
            email,
            Password: hashedPassword,
            date: Date.now(),
        }

        const newUser = new memberModel(user);
        await newUser.save();

        // Take ID
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success: true,token})

    }catch(error){
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


//API For USER LOGIN

const loginUser = async(req,res) =>{
    try{
        const {email,Password} = req.body
        const user = await memberModel.findOne({email})

        if(!user){
           return res.json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(Password,user.Password)

        if(isMatch){
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({ success: true, token });
        }else{
            res.json({ success: false, message: "Invalied credentials" });
        }

    }catch(error){
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}


export {registerUser,loginUser}
