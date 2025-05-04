import {addannoucemnt,deleteAnnoucement,displayAllAnnoucemnts,displayAnnoucemnt,updateAnnoucement, countByType, displayAnnoumentWithAudience} from "../controllers/annoucementController.js";
import express from"express";

const announcementRouter=express.Router();

announcementRouter.post("/addAnnouncement", addannoucemnt);

announcementRouter.get('/announcements', displayAllAnnoucemnts);

announcementRouter.get('/displayAnnoucemnt/:audience', displayAnnoucemnt);

announcementRouter.delete("/deleteAnnoucement/:id",deleteAnnoucement);

announcementRouter.put("/updateAnnoucement/:id",updateAnnoucement);

announcementRouter.get('/countByType', countByType);

announcementRouter.get('/audience-announcements', displayAnnoumentWithAudience);

export default announcementRouter;


