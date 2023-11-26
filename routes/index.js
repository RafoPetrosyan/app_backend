import {Router} from "express";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from "../swagger.json" assert {type: 'json'};
import users from "./users.js";

const router = Router();

const options = {
  explorer: false,
  customCss: '.swagger-ui .topbar { display:none}',
  sorter: "alpha",
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-muted.css'
};

router.get('/', (req, res, next) => {
  res.json({status: 'ok'});
})

router.use('/users', users);
router.use('/docs', swaggerUi.serve,  swaggerUi.setup(swaggerDocument, options));

export default router;
