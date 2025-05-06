import express from 'express';
import eventModel from '../models/eventModel.js';
import { 
    addEvent, 
    displayAllEvent, 
    displaySingleEvent, 
    deleteEvent, 
    updateEvent,
    requestEvent,
    getEventRequests,
    updateRequestStatus,
    markAttendance
} from '../controllers/eventController.js';

const router = express.Router();

// Existing routes
router.post('/add-event', addEvent);
router.get('/all-events', displayAllEvent);
router.get('/my-events', displaySingleEvent);
router.delete('/delete-event/:id', deleteEvent);
router.put('/update-event/:id', updateEvent);

// New routes for event requests
router.post('/request-event', requestEvent);
router.get('/event-requests/:eventId', getEventRequests);
router.put('/update-request/:requestId', updateRequestStatus);

// New route for marking attendance
router.post('/mark-attendance', markAttendance);

// --- Add this route for single event ---
router.get('/single-event/:id', async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router; 