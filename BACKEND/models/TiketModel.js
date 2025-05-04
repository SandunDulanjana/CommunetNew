import mongoose from 'mongoose';

const tiketSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    reply: { type: String }
});

const TiketModel = mongoose.models.tikets || mongoose.model('tikets', tiketSchema);
export default TiketModel;
