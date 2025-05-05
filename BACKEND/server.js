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
import announcementRouter from './routes/annoucemntRouter.js';
import ruleRoutes from './routes/ruleRoutes.js';
import expenseRouter from '../BACKEND/routes/expenseRouter.js';
import pollrouter from '../BACKEND/routes/pollRoute.js';
import ProfileRouter from './routes/ProfileRoute.js';
import ticketRouter from '../BACKEND/routes/TicketRoute.js';
//app config
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connect_DB();
connectCloudinary();

//middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

//api endpoints
app.use('/api/member', memberRouter);
app.use('/api/maintenace', maintenanceRoute);
app.use('/api/user', userRouter);
app.use('/api/announcement', announcementRouter);
app.use('/api/rules', ruleRoutes);
app.use('/api/event', eventRouter);
app.use('/api/expense', expenseRouter);
app.use('/api/poll', pollrouter);
app.use('/api/ProfileRouter', ProfileRouter);
app.use('/api/ticket', ticketRouter);
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

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}`);
});
