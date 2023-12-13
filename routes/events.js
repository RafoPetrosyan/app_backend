import {Router} from "express";
import authorization from "../middlewares/authorization.js";
import EventsController from "../controllers/EventsController.js";

const router = Router();

router.post('/create', authorization, EventsController.createEvent)

export default router;
