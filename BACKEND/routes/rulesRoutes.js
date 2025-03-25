import {addrules,displayrules,deleterules,updaterule} from "../controllers/adminController.js";
import express from"express";

const rulesRouter=express.Router();

rulesRouter.post("/addrules", addrules);

rulesRouter.get("/displayrule",displayrules);

rulesRouter.delete("/deleterules/:id",deleterules);

rulesRouter.put("/updaterules/:id",updaterule);

export default rulesRouter;
