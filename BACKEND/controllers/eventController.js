import validator from 'validator';
import eventModel from '../models/eventModel.js';
import { sendApprovalEmail, sendRejectionEmail } from '../services/emailService.js';
import jwt from 'jsonwebtoken';
import eventRequestModel from '../models/eventRequestModel.js';
import { sendRequestNotificationEmail, sendRequestStatusEmail } from '../services/emailService.js';
import memberModel from '../models/memberModel.js';


//API for add user data
const addEvent = async(req,res) => {
    try{
        // Get token from request headers
        const token = req.headers.authorization?.split(' ')[1];
        console.log("AddEvent - Received token:", token);
        
        if (!token) {
            return res.json({success: false, message: "No token provided"});
        }

        // Verify token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("AddEvent - Decoded user ID:", userId);

        const {eventName,organizarName,discription,date,time,venue,organizarContactNo,organizarEmail,expectedCount,requestType,status} = req.body
        console.log("AddEvent - Received form data:", req.body);
        
        if(!eventName || !organizarName || !discription || !date || !time || !venue || !organizarContactNo || !organizarEmail || !expectedCount || !requestType){
           return res.json({success:false, message: "All fields are required"});
        }
        if(!(organizarContactNo.length === 10)){
            return res.json({success:false, message: "Contact number is too long"});}

        if(!validator.isEmail(organizarEmail)){
            return res.json({success:false, message: "Please enter valid email"});
        }

        if(discription.length > 1000){
            return res.json({success:false, message: "Discriptin length is too long"});
        }

        const eventData = {
            userId: userId.toString(),
            eventName,
            organizarName,
            discription,
            date,
            time,
            venue,
            organizarContactNo,
            organizarEmail,
            expectedCount,
            requestType,
            status: status || 'Pending'
        }
        console.log("AddEvent - Event data to be saved:", eventData);

        const newEvent = new eventModel(eventData);
        console.log("AddEvent - New event object created:", newEvent);
        
        const savedEvent = await newEvent.save();
        console.log("AddEvent - Event saved successfully:", savedEvent);

        res.json({success:true, message: "The event created", event: savedEvent});

    }catch(error){
        console.log("AddEvent - Error:", error);
        res.json({success:false, message: error.message});
    }
}

const displayAllEvent = async (req, res) => {
    try{

        const AllEvent = await eventModel.find()

        return res.json({success: true,AllEvent})

    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}  

const displaySingleEvent = async (req,res) => {
    try{
        // Get token from request headers
        const token = req.headers.authorization?.split(' ')[1];
        console.log("DisplaySingleEvent - Received token:", token);
        
        if (!token) {
            return res.json({success: false, message: "No token provided"});
        }

        // Verify token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("DisplaySingleEvent - Decoded user ID:", userId);
        console.log("DisplaySingleEvent - Full decoded token:", decoded);

        // First, let's check if there are any events in the database
        const allEvents = await eventModel.find({});
        console.log("DisplaySingleEvent - All events in database:", JSON.stringify(allEvents, null, 2));

        // Try different ways to find events for this user
        const queries = [
            { userId: userId },
            { userId: userId.toString() },
            { userId: { $regex: new RegExp(userId, 'i') } },
            { userId: { $exists: true } }
        ];

        for (const query of queries) {
            console.log(`DisplaySingleEvent - Trying query:`, query);
            const events = await eventModel.find(query);
            console.log(`DisplaySingleEvent - Results for query:`, JSON.stringify(events, null, 2));
        }

        // Return all events for now to see what's in the database
        return res.json({
            success: true, 
            event: allEvents,
            debug: {
                userId,
                totalEvents: allEvents.length,
                queries: queries.map(q => ({
                    query: q,
                    count: allEvents.filter(e => e.userId === userId).length
                }))
            }
        });

    }catch(error){
        console.log("DisplaySingleEvent - Error:", error);
        res.json({success: false, message: error.message})
    }
}

const deleteEvent= async (req,res) => {
    try{
        const eventId = req.params.id;

        await eventModel.findByIdAndDelete(eventId)

        return res.json({success: true, message: "Item Delected"})


    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message})
    }
}

const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const { status } = req.body;

        // Get the current event
        const currentEvent = await eventModel.findById(eventId);
        if (!currentEvent) {
            return res.json({ success: false, message: "Event not found" });
        }

        // Update the event status
        const updatedEvent = await eventModel.findByIdAndUpdate(
            eventId,
            { status },
            { new: true }
        );

        // Send email notification based on status
        if (status === 'Approved') {
            await sendApprovalEmail(updatedEvent);
            console.log(`Approval email sent to ${updatedEvent.organizarEmail}`);
        } else if (status === 'Rejected') {
            await sendRejectionEmail(updatedEvent);
            console.log(`Rejection email sent to ${updatedEvent.organizarEmail}`);
        }

        return res.json({ 
            success: true, 
            message: `Event ${status.toLowerCase()} successfully`,
            event: updatedEvent 
        });
    } catch (error) {
        console.error('Error updating event:', error);
        res.json({ success: false, message: error.message });
    }
};

// Request to join an event
const requestEvent = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const requesterId = decoded.id;

        const { eventId, message } = req.body;
        if (!eventId || !message) {
            return res.json({ success: false, message: "Event ID and message are required" });
        }

        // Get event details
        const event = await eventModel.findById(eventId);
        if (!event) {
            return res.json({ success: false, message: "Event not found" });
        }

        // Get user details from token
        const user = await memberModel.findById(requesterId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Create request
        const request = new eventRequestModel({
            eventId,
            requesterId,
            requesterName: user.name,
            requesterEmail: user.email,
            requesterPhone: user.phoneNumber,
            message
        });

        await request.save();

        // Send notification email to event creator
        await sendRequestNotificationEmail(event, request);

        res.json({ 
            success: true, 
            message: "Request sent successfully",
            request 
        });
    } catch (error) {
        console.error('Error in requestEvent:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get requests for an event
const getEventRequests = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { eventId } = req.params;
        
        // Verify that the user is the event creator
        const event = await eventModel.findById(eventId);
        if (!event || event.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const requests = await eventRequestModel.find({ eventId });
        res.json({ success: true, requests });
    } catch (error) {
        console.error('Error in getEventRequests:', error);
        res.json({ success: false, message: error.message });
    }
};

// Update request status
const updateRequestStatus = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { requestId } = req.params;
        const { status } = req.body;

        // Get request details
        const request = await eventRequestModel.findById(requestId);
        if (!request) {
            return res.json({ success: false, message: "Request not found" });
        }

        // Verify that the user is the event creator
        const event = await eventModel.findById(request.eventId);
        if (!event || event.userId !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        // Update request status
        request.status = status;
        await request.save();

        // Send email notification to requester
        await sendRequestStatusEmail(event, request);

        res.json({ 
            success: true, 
            message: `Request ${status.toLowerCase()} successfully`,
            request 
        });
    } catch (error) {
        console.error('Error in updateRequestStatus:', error);
        res.json({ success: false, message: error.message });
    }
};

// Mark attendance
const markAttendance = async (req, res) => {
    try {
        const { eventId } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.json({ success: false, message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const event = await eventModel.findById(eventId);
        if (!event) return res.json({ success: false, message: "Event not found" });

        // Prevent duplicate attendance
        if (event.attendees && event.attendees.includes(userId)) {
            return res.json({ success: false, message: "Already marked attendance" });
        }

        event.attendees = event.attendees || [];
        event.attendees.push(userId);
        await event.save();

        res.json({ success: true, message: "Attendance marked successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export { addEvent, displayAllEvent, displaySingleEvent, deleteEvent, updateEvent, requestEvent, getEventRequests, updateRequestStatus, markAttendance };




