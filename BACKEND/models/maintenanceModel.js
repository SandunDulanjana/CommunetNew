import mongoose from "mongoose";

const requestformSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    houseNo: { type: Number, required: true },
    category: { type: String, required: true ,default: "Not selected" },
    details: { type: String, required: true },
    priority: { type: String, required: true ,default: "Not selected" },
    images: { type: String , required: false},
    date : {type : Date, required : true}
})

const maintenanceModel = mongoose.models.maintenanceRequest || mongoose.model('maintenanceRequest', requestformSchema)

export default maintenanceModel