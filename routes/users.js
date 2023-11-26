import {Router} from "express";
import UsersController from "../controllers/UsersController.js";

const router = Router();

router.get('/', UsersController.usersList)
router.post('/sign-in', UsersController.signIn)
router.post('/sign-up', UsersController.signUp)
router.put('/update-profile', UsersController.updateProfile)

export default router;
