import express from 'express'
import { addForm , displayAllMaintainRequests ,MaintainanceRequest  , updateForm , deleteMaintenanceRequest} from '../controllers/maintenanceController.js'
import upload from '../middlewares/multer.js'

const maintenanceRouter = express.Router()

maintenanceRouter.post('/add-requestform',upload.single('images'),addForm)
maintenanceRouter.get('/displayAllMaintainRequests',displayAllMaintainRequests)
maintenanceRouter.get('/MaintainanceRequest/:id',MaintainanceRequest)
maintenanceRouter.put('/UpdateMaintainanceRequest/:id',updateForm)
maintenanceRouter.delete('/DeleteMaintainanceRequest/:id',deleteMaintenanceRequest)

export default maintenanceRouter
