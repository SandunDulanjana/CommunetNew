import mongoose from 'mongoose';


const eventSchema = new mongoose.Schema({

        eventName : {type:String, required: true},
        organizarName : {type:String, required: true},
        discription : {type:String, required: true},
        date : {type:String, required: true},
        time : {type:Number, required: true},
        venue : {type:String, required: true},
        organizarContactNo : {type:String, required: true},
        organizarEmail : {type:String, required: true},
        expectedCount : {type:Number, required: true}

})

const eventModel = mongoose.models.events || mongoose.model('events', eventSchema);
export default eventModel;
