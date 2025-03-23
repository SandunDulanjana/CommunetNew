import mongoose from 'mongoose';
const rulesSchema= new mongoose.Schema({


    Rule_subject:{type:String,required:true},
    discription:{type:String,required:true},
    
    date:{type:Date,required:true}
    
    
})
const rulesModel= mongoose.model.raiseticket || mongoose.model('rules',rulesSchema);
export default rulesModel;

