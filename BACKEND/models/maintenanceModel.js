import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    houseNo: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    images: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    rejectionReason: {
        type: String
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Drop the existing model if it exists
if (mongoose.models.maintenanceRequest) {
    delete mongoose.models.maintenanceRequest;
}

// Create the model with a new collection name
const maintenanceModel = mongoose.model('maintenanceRequest', maintenanceSchema, 'maintenance_requests_new');

export default maintenanceModel;