import HttpError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import Debug from "debug";
import cron from "node-cron";
import indexRouter from "./routes/index.js";
import cors from "./middlewares/cors.js";
import language from "./middlewares/language.js";
import deleteCalendarOldData from "./helpers/deleteCalendarOldData.js";

const debug = Debug('app:index');
const app = express();

app.set('trust proxy', 1);
app.use(cors);
app.use(language);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static(path.resolve('./public')));

app.use('/api', indexRouter);

app.use((req, res, next) => {
    next(HttpError(404));
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        status: 'error',
        message: err.message,
        stack: err.stack,
        errors: err.errors,
    })
});

const cronJob = cron.schedule('0 0 * * *', deleteCalendarOldData);
cronJob.start();

debug('hello')

export default app;
