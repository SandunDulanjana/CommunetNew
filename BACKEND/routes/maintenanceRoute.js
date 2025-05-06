import express from 'express';
import {
  addForm,
  displayAllMaintainRequests,
  MaintenanceRequest,
  updateForm,
  deleteMaintenanceRequest,
  rejectRequest,
  acceptRequest
} from '../controllers/maintenanceController.js';
import upload from '../middlewares/multer.js';

const maintenanceRouter = express.Router();

// Use the `upload` middleware
maintenanceRouter.post('/add-requestform', upload.single('images'), addForm);
maintenanceRouter.get('/displayAllMaintenanceRequests', displayAllMaintainRequests);
maintenanceRouter.get('/MaintenanceRequest/:id', MaintenanceRequest);
maintenanceRouter.put('/UpdateMaintenanceRequest/:id', upload.single('images'), updateForm);
maintenanceRouter.delete('/DeleteMaintenanceRequest/:id', deleteMaintenanceRequest);
maintenanceRouter.post('/reject/:id', rejectRequest);
maintenanceRouter.post('/accept/:id', acceptRequest);

export default maintenanceRouter;
