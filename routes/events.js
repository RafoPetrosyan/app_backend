import {Router} from "express";
import authorization from "../middlewares/authorization.js";
import EventsController from "../controllers/EventsController.js";
import upload from "../middlewares/upload.js";
import {imageMimTypes} from "../constants/index.js";

const router = Router();

router.get('/', authorization, EventsController.getEvents)
router.get('/:id', authorization, EventsController.getEventById)
router.post(
    '/',
    authorization,
    upload(imageMimTypes).fields([{name: 'cover_image', maxCount: 1}, {name: 'images[]', maxCount: 10}]),
    EventsController.createEvent,
)
router.put(
    '/:id',
    authorization,
    upload(imageMimTypes).fields([{name: 'cover_image', maxCount: 1}, {name: 'images[]', maxCount: 10}]),
    EventsController.updateEvent,
)
router.delete('/:id', authorization, EventsController.deleteEvent)

export default router;
