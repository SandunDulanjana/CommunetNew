import mongoose from "mongoose";

const requestformSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true },
    houseNo: { type: Number, required: true },
    category: { type: String, required: true, default: "Not selected" },
    details: { type: String, required: true },
    priority: { type: String, required: true, default: "Not selected" },
    images: { type: String, required: false },
    date: { type: Date, required: true, default: Date.now }
});

// Drop the existing model if it exists
if (mongoose.models.maintenanceRequest) {
    delete mongoose.models.maintenanceRequest;
}

// Create the model with a new collection name
const maintenanceModel = mongoose.model('maintenanceRequest', requestformSchema, 'maintenance_requests_new');

export default maintenanceModel;