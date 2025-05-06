import mongoose from 'mongoose';

const eventRequestSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    requesterId: {
        type: String,
        required: true
    },
    requesterName: {
        type: String,
        required: true
    },
    requesterEmail: {
        type: String,
        required: true
    },
    requesterPhone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
eventRequestSchema.index({ eventId: 1, requesterId: 1 });
eventRequestSchema.index({ status: 1 });

const eventRequestModel = mongoose.model('EventRequest', eventRequestSchema);

export default eventRequestModel; 