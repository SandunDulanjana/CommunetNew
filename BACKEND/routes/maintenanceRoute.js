import express from 'express';
import multer from 'multer'; // Only required if you need custom configurations later
import {
  addForm,
  displayAllMaintainRequests,
  MaintainanceRequest,
  updateForm,
  deleteMaintenanceRequest
} from '../controllers/maintenanceController.js';
import upload from '../middlewares/multer.js'; // Reuse the upload middleware

const maintenanceRouter = express.Router();

// Use the `upload` middleware from '../middlewares/multer.js'
maintenanceRouter.post('/add-requestform', upload.single('images'), addForm);
maintenanceRouter.get('/displayAllMaintainRequests', displayAllMaintainRequests);
maintenanceRouter.get('/MaintainanceRequest/:id', MaintainanceRequest);
maintenanceRouter.put('/UpdateMaintainanceRequest/:id', upload.single('images'), updateForm);
maintenanceRouter.delete('/DeleteMaintainanceRequest/:id', deleteMaintenanceRequest);

export default maintenanceRouter;
