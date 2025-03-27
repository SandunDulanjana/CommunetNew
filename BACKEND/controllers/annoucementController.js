import annouceModel from "../models/annoucementModel.js"; // Fixed typo

// Insert
export const addAnnouncement = async (req, res) => {
    try {
        const { Type, description, audience } = req.body;

        if (!Type || !description || !audience) {
            return res.status(400).json({ success: false, message: "Missing details" }); // Added status code
        }

        const announcementData = {
            Type,
            description,
            date: Date.now(),
            audience,
        };

        const newAnnouncement = new annouceModel(announcementData); // Fixed typo
        await newAnnouncement.save();

        res.status(201).json({ success: true, message: "Announcement added successfully" }); // Added status code
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message }); // Added status code
    }
};

// Read all announcements
export const displayAllAnnouncements = async (req, res) => {
    try {
        const allAnnouncements = await annouceModel.find(); // Fixed typo
        return res.status(200).json({ success: true, allAnnouncements });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message }); // Added status code
    }
};

// Read a specific announcement
export const displayAnnouncement = async (req, res) => {
    try {
        const announcementAudience = req.params.audience;
        const announcement = await annouceModel.find({ audience: announcementAudience }); // Fixed typo

        return res.status(200).json({ success: true, announcement });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete announcement
export const deleteAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id;

        await annouceModel.findByIdAndDelete(announcementId); // Fixed typo

        return res.status(200).json({ success: true, message: "Announcement deleted" }); // Added status code
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update announcement
export const updateAnnouncement = async (req, res) => {
    try {
        const announcementId = req.params.id;

        const { Type, description, audience } = req.body;

        if (!Type || !description || !audience) {
            return res.status(400).json({ success: false, message: "Missing details" }); // Added status code
        }

        await annouceModel.findByIdAndUpdate(announcementId, { // Fixed typo
            $set: { Type, description, audience },
        });

        res.status(200).json({ success: true, message: "Announcement updated successfully" }); // Added status code
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
