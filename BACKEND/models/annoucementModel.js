import mongoose from 'mongoose';
const annouceSchema= new mongoose.Schema({


    Type:{type:String,required:true},
    discription:{type:String,required:true},
    date:{type:Date,required:true},
    audience:{type:String,required:true}
    
})

const annoucementModel= mongoose.model.annoucements || mongoose.model('annoucements',annouceSchema);
export default annoucementModel;