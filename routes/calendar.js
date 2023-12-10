import {Router} from "express";
import CalendarController from "../controllers/CalendarController.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.post('/', authorization, CalendarController.addFreeDay)

export default router;
