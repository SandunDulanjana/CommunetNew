import validator from "validator";
import maintenanceModel from "../models/maintenanceModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

const addForm = async (req, res) => {
    try {
        console.log('Starting addForm function...');
        
        // Handle multer errors
        if (req.fileValidationError) {
            console.log('Multer validation error:', req.fileValidationError);
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }

        const { name, phone, email, houseNo, category, details, priority } = req.body;
        const imageFile = req.file;

        console.log('Received request:', {
            body: req.body,
            file: imageFile ? {
                filename: imageFile.filename,
                path: imageFile.path,
                size: imageFile.size
            } : 'No file'
        });

        // Validate required fields
        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            console.log('Missing required fields:', { name, phone, email, houseNo, category, details, priority });
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Validate email
        if (!validator.isEmail(email)) {
            console.log('Invalid email:', email);
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            console.log('Invalid phone number:', phone);
            return res.status(400).json({ success: false, message: "Invalid phone number" });
        }

        let imageUrl = null;
        if (imageFile) {
            try {
                console.log('Attempting to upload to Cloudinary...');
                console.log('Cloudinary config:', {
                    cloud_name: process.env.CLOUDINARY_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    has_secret: !!process.env.CLOUDINARY_SECRET_KEY
                });
                
                const uploadResponse = await cloudinary.uploader.upload(imageFile.path, {
                    folder: "maintenance_requests",
                });
                console.log('Cloudinary upload successful:', uploadResponse.secure_url);
                imageUrl = uploadResponse.secure_url;

                // Delete the temporary file after successful upload
                fs.unlink(imageFile.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // Delete the temporary file if upload fails
                fs.unlink(imageFile.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload image",
                    error: uploadError.message 
                });
            }
        }

        // Create new maintenance request
        const newRequest = new maintenanceModel({
            name,
            phone: parseInt(phone, 10),
            email,
            houseNo: parseInt(houseNo, 10),
            category,
            details,
            priority,
            images: imageUrl,
            date: new Date()
        });

        await newRequest.save();
        console.log('Maintenance request saved successfully');

        res.status(201).json({ success: true, message: "Request added successfully" });
    } catch (error) {
        console.error('Error in addForm:', error);
        console.error('Error stack:', error.stack);
        
        // Handle specific error types
        if (error.code === 11000) {
            res.status(400).json({ 
                success: false, 
                message: "A request with this email already exists",
                error: error.message 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: "Internal server error",
                error: error.message 
            });
        }
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

const MaintenanceRequest = async (req, res) => {
    try {
        const maintenanceId = req.params.id;
        const maintenanceRequest = await maintenanceModel.findById(maintenanceId)
        return res.status(200).json({ success: true, maintenanceRequest });

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
        console.log('File:', req.file);

        const { name, phone, email, houseNo, category, details, priority } = req.body;

        // Validate required fields
        if (!name || !phone || !email || !houseNo || !category || !details || !priority) {
            return res.status(400).json({ success: false, message: 'Cannot update, Missing required fields' });
        }

        // Get the current maintenance request
        const currentRequest = await maintenanceModel.findById(maintenanceId);
        if (!currentRequest) {
            return res.status(404).json({ success: false, message: 'Maintenance request not found' });
        }

        // Handle image upload
        let imageUrl = currentRequest.images; // Keep existing image by default
        if (req.file) {
            try {
                console.log('Uploading new image to Cloudinary...');
                const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'maintenance_requests',
                });
                console.log('Cloudinary upload successful:', uploadResponse.secure_url);
                imageUrl = uploadResponse.secure_url;

                // Delete the temporary file after successful upload
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                // Delete the temporary file if upload fails
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('Error deleting temporary file:', err);
                    }
                });
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to upload image",
                    error: uploadError.message 
                });
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
            images: imageUrl // Always include the image URL (either new or existing)
        };

        // Update the maintenance request
        const updatedRequest = await maintenanceModel.findByIdAndUpdate(
            maintenanceId, 
            updatedData, 
            { new: true }
        );

        console.log('Updated maintenance request:', updatedRequest);

        return res.status(200).json({ 
            success: true, 
            message: 'Maintenance details updated successfully',
            maintenanceRequest: updatedRequest
        });
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
export { addForm, displayAllMaintainRequests, MaintenanceRequest, updateForm, deleteMaintenanceRequest };
