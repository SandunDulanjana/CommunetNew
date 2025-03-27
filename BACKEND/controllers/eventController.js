
import validator from 'validator';
import eventModel from '../models/eventModel.js';


//API for add user data
const addEvent = async(req,res) => {
    try{
        const {eventName,organizarName,discription,date,time,venue,organizarContactNo,organizarEmail,expectedCount,requestType} = req.body
        
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
            eventName,
            organizarName,
            discription,
            date,
            time,
            venue,
            organizarContactNo,
            organizarEmail,
            expectedCount,
            requestType
        }
        const newEvent = new eventModel(eventData);
        await newEvent.save();

        res.json({success:true,message: "The event created"});



    }catch(error){
        console.log(error);
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
        const eventId = req.params.id;

        const event = await eventModel.findById(eventId)

        return res.json({success: true, event})

    }catch(error){
        console.log(error);
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

const updateEvent = async (req,res) => {
    try{
        const eventId = req.params.id;

        const {eventName,organizarName,discription,date,time,venue,organizarContactNo,organizarEmail,expectedCount,requestType} = req.body
        
        if(!eventName || !organizarName || !discription || !date || !time || !venue || !organizarContactNo || !organizarEmail || !expectedCount || !requestType){
           return res.json({success:false, message: "All fields are required"});
        }

        if(!validator.isEmail(organizarEmail)){
            return res.json({success:false, message: "Please enter valid email"});
        }

        if(discription.length > 1000){
            return res.json({success:false, message: "Discriptin length is too long"});
        }

        await eventModel.findByIdAndUpdate(eventId, {$set: {eventName,organizarName,discription,date,time,venue,organizarContactNo,organizarEmail,expectedCount,requestType}})
        res.json({success: true, message: "Event updadet successfully."})

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message})
    }

}
export { addEvent, displayAllEvent, displaySingleEvent, deleteEvent, updateEvent };




