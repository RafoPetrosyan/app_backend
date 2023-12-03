import {Router} from "express";
import UsersController from "../controllers/UsersController.js";
import CategoriesController from "../controllers/CategoriesController.js";
import adminAuthorization from "../middlewares/adminAuthorization.js";

const router = Router();

router.get('/users', adminAuthorization, UsersController.usersList)
router.post('/sign-in', UsersController.adminSignIn)

router.get('/categories', adminAuthorization, CategoriesController.adminCategoriesList)
router.get('/sub-categories', adminAuthorization, CategoriesController.adminSubCategoriesList)

export default router;
