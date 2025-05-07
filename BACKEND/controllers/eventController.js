import validator from 'validator';
import eventModel from '../models/eventModel.js';
import { sendApprovalEmail, sendRejectionEmail } from '../services/emailService.js';
import jwt from 'jsonwebtoken';
import eventRequestModel from '../models/eventRequestModel.js';
import { sendRequestNotificationEmail, sendRequestStatusEmail } from '../services/emailService.js';
import memberModel from '../models/memberModel.js';
import { useState } from 'react';


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

        // Check for date+venue conflict with approved events
        const conflict = await eventModel.findOne({
            date: date,
            venue: venue,
            status: 'Approved'
        });
        if (conflict) {
            return res.json({
                success: false,
                message: "An approved event already exists for this date and venue. Please choose a different date or venue."
            });
        }

        // Check if venue is "At home" and validate house number
        if (venue.startsWith('At home - ')) {
            const houseNumber = venue.split(' - ')[1];
            const existingEvent = await eventModel.findOne({
                venue: { $regex: new RegExp(`^At home - ${houseNumber}$`, 'i') },
                status: 'Approved'
            });

            if (existingEvent) {
                return res.json({
                    success: false,
                    message: "This house number is already booked for an approved event. Please choose a different house number."
                });
            }
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

const displaySingleEvent = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.json({success: false, message: "No token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Only return events created by this user
        const userEvents = await eventModel.find({ userId: userId.toString() });

        return res.json({
            success: true, 
            event: userEvents
        });
    } catch(error) {
        res.json({ success: false, message: error.message })
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
        const updateData = req.body;

        // Get the current event
        const currentEvent = await eventModel.findById(eventId);
        if (!currentEvent) {
            return res.json({ success: false, message: "Event not found" });
        }

        // If status is being updated to Approved or Rejected, skip full validation
        if (updateData.status && (updateData.status === 'Approved' || updateData.status === 'Rejected')) {
            console.log('Processing status update:', {
                eventId,
                newStatus: updateData.status,
                currentStatus: currentEvent.status
            });

            // Update with all fields from updateData, not just status
            const updatedEvent = await eventModel.findByIdAndUpdate(
                eventId,
                updateData,
                { new: true }
            );

            console.log('Event updated in database:', {
                eventId: updatedEvent._id,
                status: updatedEvent.status,
                organizerEmail: updatedEvent.organizarEmail
            });

            // Send email notification if status changed
            if (updateData.status !== currentEvent.status) {
                try {
                    if (updateData.status === 'Approved') {
                        console.log('Sending approval email...');
                        await sendApprovalEmail(updatedEvent);
                    } else if (updateData.status === 'Rejected') {
                        console.log('Sending rejection email...');
                        await sendRejectionEmail(updatedEvent, updateData.reason);
                    }
                } catch (emailError) {
                    console.error('Failed to send email notification:', emailError);
                    // Continue with the response even if email fails
                }
            }

            return res.json({
                success: true,
                message: "Event status updated successfully",
                event: updatedEvent
            });
        }

        // Otherwise, do full validation
        // Validate required fields
        const requiredFields = ['eventName', 'organizarName', 'discription', 'date', 'time', 
                              'venue', 'organizarContactNo', 'organizarEmail', 'expectedCount', 'requestType'];
        
        for (const field of requiredFields) {
            if (!updateData[field]) {
                return res.json({ success: false, message: `${field} is required` });
            }
        }

        // Validate email
        if (!validator.isEmail(updateData.organizarEmail)) {
            return res.json({ success: false, message: "Please enter valid email" });
        }

        // Validate phone number
        if (!(updateData.organizarContactNo.length === 10)) {
            return res.json({ success: false, message: "Contact number must be 10 digits" });
        }

        // Validate description length
        if (updateData.discription.length > 1000) {
            return res.json({ success: false, message: "Description length is too long" });
        }

        // Check if venue is "At home" and validate house number
        if (updateData.venue.startsWith('At home - ')) {
            const houseNumber = updateData.venue.split(' - ')[1];
            const existingEvent = await eventModel.findOne({
                venue: { $regex: new RegExp(`^At home - ${houseNumber}$`, 'i') },
                status: 'Approved',
                _id: { $ne: eventId } // Exclude current event from check
            });

            if (existingEvent) {
                return res.json({
                    success: false,
                    message: "This house number is already booked for an approved event. Please choose a different house number."
                });
            }
        }

        // Update the event with all fields
        const updatedEvent = await eventModel.findByIdAndUpdate(
            eventId,
            updateData,
            { new: true, runValidators: true }
        );

        // Send email notification if status changed
        if (updateData.status && updateData.status !== currentEvent.status) {
            if (updateData.status === 'Approved') {
                await sendApprovalEmail(updatedEvent);
            } else if (updateData.status === 'Rejected') {
                await sendRejectionEmail(updatedEvent, updateData.reason);
            }
        }

        return res.json({ 
            success: true, 
            message: "Event updated successfully",
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




