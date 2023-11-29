import {Router} from "express";
import CategoriesController from "../controllers/CategoriesController.js";
import authorization from "../middlewares/authorization.js";

const router = Router();

router.get('/', CategoriesController.categoriesList)
router.get('/sub', CategoriesController.subCategoriesList)

export default router;
