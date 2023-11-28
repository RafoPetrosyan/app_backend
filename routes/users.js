import {Router} from "express";
import UsersController from "../controllers/UsersController.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get('/', authorization, UsersController.usersList)
router.post('/sign-in', UsersController.signIn)
router.post('/sign-up', UsersController.signUp)
router.put('/update-profile', authorization, UsersController.updateProfile)
router.post('/confirm-verification', authorization, UsersController.confirmVerification)
router.post('/resend-verification', authorization, UsersController.resendVerification)

export default router;
