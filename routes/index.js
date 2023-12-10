import {Router} from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "../swagger.json" assert {type: 'json'};
import users from "./users.js";
import admin from "./admin.js";
import categories from "./categories.js";
import calendar from "./calendar.js";

const router = Router();

const swaggerOptions = {
  explorer: false,
  customCss: '.swagger-ui .topbar { display:none}',
  sorter: "alpha",
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui@5.10.3/dist/swagger-ui.min.css'
};

router.get('/', (req, res, next) => {
  res.json({status: 'ok'});
})

router.use('/users', users);
router.use('/admin', admin);
router.use('/categories', categories);
router.use('/calendar', calendar);
router.use('/doc', swaggerUi.serve,  swaggerUi.setup(swaggerDocument, swaggerOptions));

export default router;
