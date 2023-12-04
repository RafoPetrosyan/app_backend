import {Router} from "express";
import UsersController from "../controllers/UsersController.js";
import CategoriesController from "../controllers/CategoriesController.js";
import adminAuthorization from "../middlewares/adminAuthorization.js";
import upload from "../middlewares/upload.js";
import {imageMimTypes} from "../constants/index.js";

const router = Router();

router.get('/users', adminAuthorization, UsersController.usersList)
router.post('/sign-in', UsersController.adminSignIn)

router.get('/categories', adminAuthorization, CategoriesController.adminCategoriesList)
router.get('/sub-categories', adminAuthorization, CategoriesController.adminSubCategoriesList)
router.get('/category/:id', adminAuthorization, CategoriesController.getCategoryById)
router.get('/sub-category/:id', adminAuthorization, CategoriesController.getSubCategoryById)
router.post('/category',
    adminAuthorization,
    upload(imageMimTypes).single('image'),
    CategoriesController.createCategory
)
router.put('/category/:id',
    adminAuthorization,
    upload(imageMimTypes).single('image'),
    CategoriesController.updateCategory
)

export default router;
