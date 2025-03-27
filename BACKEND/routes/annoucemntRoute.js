import {addAnnouncement,deleteAnnouncement,displayAllAnnouncements,displayAnnouncement,updateAnnouncement} from "../controllers/annoucementController.js";
import express from"express";

const annoucementRouter=express.Router();
annoucementRouter.post("/addannoucemnt",addAnnouncement);

annoucementRouter.get("/annoucements", displayAllAnnouncements);

annoucementRouter.get("/displayAnnoucemnt/:audience", displayAnnouncement);

annoucementRouter.delete("/deleteAnnoucement/:id",deleteAnnouncement);

annoucementRouter.put("/updateAnnoucement/:id",updateAnnouncement);

export default annoucementRouter;