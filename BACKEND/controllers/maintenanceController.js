import validator from "validator";
import maintenanceModel from "../models/maintenanceModel.js";
import { v2 as cloudinary } from "cloudinary";

const addForm = async (req, res) => {
    try {
        const { name, phone, email, houseNo, category, details, priority } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ success: false, message: "Invalid phone number" });
        }

        let imageUrl = null;
        if (imageFile) {
            const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
                folder: "maintenance_requests",
            });
            imageUrl = uploadResponse.secure_url;
        }

        const newRequest = new maintenanceModel({
            name,
            phone,
            email,
            houseNo,
            category,
            details,
            priority,
            images: imageUrl,
            date: Date.now(),
        });

        await newRequest.save();

        res.status(201).json({ success: true, message: "Request added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const displayAllMaintainRequests = async (req, res) => {
    try {
        const AllMaintainanceRequests = await maintenanceModel.find()
        return res.status(200).json({ success: true, AllMaintainanceRequests });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

const MaintainanceRequest = async (req, res) => {
    try {
        const maintenanceId = req.params.id;
        const MaintainanceRequest = await maintenanceModel.findById(maintenanceId)
        return res.status(200).json({ success: true, MaintainanceRequest });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// update
const updateForm = async (req, res) => {
    try {
        const maintenanceId = req.params.id;

        // Log received data
        console.log('Body:', req.body);
        console.log('Files:', req.files);

        const { name, phone, email, houseNo, category, details, priority } = req.body;

        // Validate required fields
        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            return res.status(400).json({ success: false, message: 'Cannot update, Missing required fields' });
        }

        // Handle image upload
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResponse = await cloudinary.uploader.upload(file.path, {
                    folder: 'maintenance_requests',
                });
                imageUrls.push(uploadResponse.secure_url);
            }
        }

        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ success: false, message: "Invalid phone number" });
        }


        const updatedData = {
            name,
            phone,
            email,
            houseNo,
            category,
            details,
            priority,
            images: imageUrls.length ? imageUrls : undefined,
        };

        // Update the maintenance request
        await maintenanceModel.findByIdAndUpdate(maintenanceId, updatedData, { new: true });

        return res.status(200).json({ success: true, message: 'Maintenance details updated successfully' });
    } catch (error) {
        console.error('Error in updateForm:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



const deleteMaintenanceRequest = async (req, res) => {

    try {
        const maintenanceId = req.params.id;
        await maintenanceModel.findByIdAndDelete(maintenanceId)
        return res.json({ success: true, message: "Maintenance request deleted successfully" });

    } catch (error) {
        return res.json({ success: false, massage: error.massage })
    }
}
export { addForm, displayAllMaintainRequests, MaintainanceRequest, updateForm, deleteMaintenanceRequest };
