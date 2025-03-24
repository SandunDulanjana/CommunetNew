import validator from "validator";
import maintenanceModel from "../models/maintenanceModel.js";
import { v2 as cloudinary } from "cloudinary";

const addForm = async (req, res) => {
    try {
        const { name, phone, email, houseNo, category, details, priority } = req.body;
        const imageFile = req.file;
       

        // Check for missing fields
        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate phone number (basic example for 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ success: false, message: "Please enter a valid phone number" });
        }

        // Handle image upload (if provided)
        let imageUrl = null;
        if (imageFile) {
            const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
                folder: "requestForms",
            });
            imageUrl = uploadResponse.secure_url;
        }

        // Create form data
        const formData = {
            name,
            phone,
            email,
            houseNo,
            category,
            details,
            priority,
            images: imageUrl,
            date: Date.now(),
        };

        // Save to the database
        const newRequest = new maintenanceModel(formData);
        await newRequest.save();

        res.status(201).json({ success: true, message: "Request added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const displayAllMaintainRequests =  async(req,res) => {
    try{
        const AllMaintainanceRequests = await maintenanceModel.find()
        return res.status(200).json({ success: true, AllMaintainanceRequests });

    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

const MaintainanceRequest =  async(req,res) => {
    try{
        const maintenanceId = req.params.id;
        const MaintainanceRequest = await maintenanceModel.findById(maintenanceId)
        return res.status(200).json({ success: true, MaintainanceRequest });

    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

// update
const updateForm = async (req, res) => {
    try {
        const maintenanceId = req.params.id;
        const { name, phone, email, houseNo, category, details, priority } = req.body;
        const imageFile = req.file;

        console.log(name)
       

        // Check for missing fields
        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Validate phone number (basic example for 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ success: false, message: "Please enter a valid phone number" });
        }

        // Handle image upload (if provided)
        let imageUrl = null;
        if (imageFile) {
            const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
                folder: "requestForms",
            });
            imageUrl = uploadResponse.secure_url;
        }

        // update form data
        const UpdatedformData = {
            name,
            phone,
            email,
            houseNo,
            category,
            details,
            priority,
            images: imageUrl,
            date: Date.now(),
        };

        // Save to the database
        await maintenanceModel.findByIdAndUpdate(maintenanceId, { $set: UpdatedformData });

        return res.json({ success: true, message: "Maintenance details updated successfully" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const deleteMaintenanceRequest = async(req,res) => {

    try{
        const maintenanceId = req.params.id;
        await maintenanceModel.findByIdAndDelete(maintenanceId)
        return res.json({ success: true, message: "Maintenance request deleted successfully" });

    }catch(error){
        return res.json({success:false, massage:error.massage})
    }
}
export { addForm , displayAllMaintainRequests ,MaintainanceRequest , updateForm , deleteMaintenanceRequest };
