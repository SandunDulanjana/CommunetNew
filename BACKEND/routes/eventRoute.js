import express from 'express';

import { addEvent, displayAllEvent, displaySingleEvent, deleteEvent, updateEvent } from '../controllers/eventController.js';

const eventRouter = express.Router();


eventRouter.post('/add-event',addEvent)

eventRouter.get('/all-events',displayAllEvent)

eventRouter.get('/single-event/:id',displaySingleEvent)

eventRouter.delete('/delete-event/:id',deleteEvent)

eventRouter.put('/update-event/:id',updateEvent)

export default eventRouter;
