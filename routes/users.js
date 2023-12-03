import {Router} from "express";
import UsersController from "../controllers/UsersController.js";
import authorization from "../middlewares/authorization.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.post('/sign-in', UsersController.signIn)
router.post('/sign-up', UsersController.signUp)
router.post('/confirm-verification', authorization, UsersController.confirmVerification)
router.post('/resend-verification', authorization, UsersController.resendVerification)
router.put('/sign-up/user-info', authorization, UsersController.signUpUserInfo)
router.put('/preferences', authorization, UsersController.addPreferences)
router.post('/forgot-password', UsersController.forgotPassword)
router.post('/forgot-password/code', UsersController.confirmRestPasswordCode)
router.put('/reset-password', authorization, UsersController.resetPassword)
router.put(
    '/update-profile',
    authorization,
    upload(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/apng']).single('avatar'),
    UsersController.updateProfile
)

export default router;
