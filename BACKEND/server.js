import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import QRCode from 'qrcode';

config();

import connect_DB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import memberRouter from './routes/memberRoute.js';
import maintenanceRoute from '../BACKEND/routes/maintenanceRoute.js';
import userRouter from '../BACKEND/routes/UserRoute.js';
import eventRouter from '../BACKEND/routes/eventRoute.js';
import annoucementRoute from '../BACKEND/routes/annoucemntRoute.js';
import rulesRouter from '../BACKEND/routes/rulesRoutes.js';

import expenseRouter from '../BACKEND/routes/expenseRouter.js';


import expenseRouter from '../BACKEND/routes/expenseRouter.js'
import pollrouter from '../BACKEND/routes/pollRoute.js'







//app config
const app = express();
const port = process.env.PORT || 5000;
connect_DB();
connectCloudinary();

//middlewares
app.use(cors());
app.use(express.json());

//api endpoints
app.use('/api/member', memberRouter);
app.use('/api/addmaintenace', maintenanceRoute);
app.use('/api/user', userRouter);
app.use('/api/annoucement', annoucementRoute);
app.use('/api/rules', rulesRouter);

app.use('/api/member',memberRouter);
app.use('/api/maintenance', maintenanceRoute)
app.use('/api/user',userRouter);
app.use("/api/annoucement",annoucementRoute);
app.use("/api/rules",rulesRouter);

app.use('/api/event', eventRouter);
app.use('/api/expense',expenseRouter)
app.use('/api/poll',pollrouter)


app.use('/api/event', eventRouter);
app.use('/api/expense', expenseRouter);


// QR Code generation endpoint
app.post('/api/generate-qr', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url);
    res.json({ qrCodeDataUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

app.get('/', (req, res) => {
  res.send('API WORKING');
});

app.listen(port, () => console.log('Server started on port', port));
