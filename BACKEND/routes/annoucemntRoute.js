import {addannoucemnt,deleteAnnoucement,displayAllAnnoucemnts,displayAnnoucemnt,updateAnnoucement} from "../controllers/annoucementController.js";
import express from"express";

const annoucementRouter=express.Router();
annoucementRouter.post("/addannoucemnt",addannoucemnt);

annoucementRouter.get('/annoucements', displayAllAnnoucemnts);

annoucementRouter.get('/displayAnnoucemnt/:audience', displayAnnoucemnt);

annoucementRouter.delete("/deleteAnnoucement/:id",deleteAnnoucement);

annoucementRouter.put("/updateAnnoucement/:id",updateAnnoucement);

export default annoucementRouter;
