import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    eventName: {
        type: String,
        required: true
    },
    organizarName: {
        type: String,
        required: true
    },
    discription: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    organizarContactNo: {
        type: String,
        required: true
    },
    organizarEmail: {
        type: String,
        required: true
    },
    expectedCount: {
        type: Number,
        required: true
    },
    requestType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected']
    },
    attendees: {
        type: Number,
        default: 0,
        required: false
    },
}, {
    timestamps: true
});

eventSchema.index({ userId: 1, status: 1 });

const eventModel = mongoose.models.events || mongoose.model('events', eventSchema);

export default eventModel;
