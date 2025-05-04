import annouceModel from"../models/annoucementModel.js";
import jwt from "jsonwebtoken";
import User from "../models/memberModel.js"; // Adjust path as needed

// insert

const addannoucemnt = async(req,res)=>{

    try{

        const {Type,discription,audience}=req.body;

        if(!Type||!discription||!audience){

            return res.json({success:false,message:"missing details"});
        }

        const annoucementData={

            Type,
            discription,
            date:Date.now(),
            audience
        }

        const newannoucement= new annouceModel(annoucementData);
        await  newannoucement.save();
        
        res.json ({success:true,message:"Add Annoucement Sucessfuly "});





    }catch(error){

        console.log(error);
        res.json({success:false,message:error.message});


    };
    
    
}
// read
const displayAllAnnoucemnts =  async(req,res) => {
    try{
        const AllAnnoucemnts = await annouceModel.find()
        return res.status(200).json({ success: true, AllAnnoucemnts });

    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

const displayAnnoucemnt = async (req, res) => {
    try {
        const AnnoucemntAudience = req.params.audience;
        const Annoucemnt = await annouceModel.find({ audience: AnnoucemntAudience });

        return res.status(200).json({ success: true, Annoucemnt });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAnnoucement=async(req,res)=>{
    try{

    const annoucementId=req.params.id;
         
    await annouceModel.findByIdAndDelete(annoucementId);

    return res.json({success: true, message:"Annoucement Delete"})


    }catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }


}


const updateAnnoucement=async(req,res)=>{

    try{

        const annoucementId= req.params.id;

        const {Type,discription,audience}=req.body;

        if(!Type||!discription||!audience){

            return res.json({success:false,message:"missing details"});
        }
        await annouceModel.findByIdAndUpdate(annoucementId,{$set:{Type,discription,audience}})
        res.json({success: true, message:"Annoucement Update Success"})




    }catch(error){

        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Count announcements by type
const countByType = async (req, res) => {
    try {
        const total = await annouceModel.countDocuments();
        const emergency = await annouceModel.countDocuments({ Type: "Emergency Notices" });
        const maintenance = await annouceModel.countDocuments({ Type: "Maintenance Updates" });
        const general = await annouceModel.countDocuments({ Type: "General Announcements" });
        res.json({
            success: true,
            counts: {
                total,
                emergency,
                maintenance,
                general
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

const displayAnnoumentWithAudience = async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ success: false, message: "No token provided" });

        // Decode token to get user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Get user and house number
        const user = await User.findById(userId);
        console.log('User found:', user);
        if (!user || !user.houseNO) {
            console.log('User or houseNO missing:', user);
            return res.status(404).json({ success: false, message: "User or house number not found" });
        }

        // Get first letter of house number
        const firstLetter = user.houseNO[0].toUpperCase();

        // Find announcements where audience matches first letter or is 'All'
        const announcements = await annouceModel.find({
            $or: [
                { audience: firstLetter },
                { audience: "All" }
            ]
        });

        return res.status(200).json({ success: true, announcements });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export{addannoucemnt,displayAllAnnoucemnts,displayAnnoucemnt,deleteAnnoucement,updateAnnoucement, countByType, displayAnnoumentWithAudience}

