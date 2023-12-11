import {Router} from "express";
import CalendarController from "../controllers/CalendarController.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get('/my-list', authorization, CalendarController.getMyCalendarList)
router.get('/list', authorization, CalendarController.getList)
router.post('/', authorization, CalendarController.addFreeTime)
router.delete('/delete/:id', authorization, CalendarController.deleteFreeTime)

export default router;
