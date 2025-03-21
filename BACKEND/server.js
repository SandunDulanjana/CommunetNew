import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { config } from 'dotenv';
config(); 
 // Instead of require("dotenv").config()

import connect_DB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import memberRouter from './routes/memberRoute.js';




//app config
const app = express();
const port = process.env.PORT || 5000;
connect_DB();
connectCloudinary();

//middlewares
app.use(cors());
app.use(express.json());

//api endpoints
app.use('/api/member',memberRouter);
app.use('/api/event', eventRouter);

app.get('/',(req,res) => {
    res.send('API WORKING '); 
})

app.listen(port, ()=> console.log("Server started",port));