import { response } from "express";
import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({

        question:{type:String, required: true},
        options : [
           {
            optionText : { type:String, required:true },
            votes : {type:Number , default:0},
           }, 
        ],

        responses : [
            {
             voterId : { type:mongoose.Schema.Types.ObjectId, ref:"User" },
             responseText : {type:String},
             createAt : {type:Date, default: Date.now},
            }, 
         ],

         creator:{type:mongoose.Schema.Types.ObjectId, ref:"User" , required:true},
         voters:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
         createdAt: {type:Date, default:Date.now},
         closed : {type:Boolean, default:false}
});

const pollModel = mongoose.models.poll || mongoose.model('poll', pollSchema);
export default pollModel;
