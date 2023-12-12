import Joi from "joi";
import moment from "moment";
import HttpError from "http-errors";
import validate from "../validations/validate.js";
import {checkValidTime} from "../helpers/index.js";
import Calendar from "../models/Calendar.js";

class EventsController {
    static createEvent = async (req, res, next) => {
        try {
            const {userId} = req;
            const {start_date, end_date, speaker_id, category_id, location, name, details} = req.body;
            const locationArray = location?.split(',')?.map(e => e.trim());

            const schema = Joi.object({
                start_date: Joi.date().default(() => moment().format('YYYY-MM-DD')).required(),
                end_date: Joi.date().default(() => moment().format('YYYY-MM-DD')).required(),
                location: Joi.array().items(Joi.string().required()).required(),
                name: Joi.string().required(),
                details: Joi.string().required(),
                category_id: Joi.string().required(),
                speaker_id: Joi.string().required(),
            });
            await validate({schema, values: {
                    start_date, end_date, speaker_id, category_id, location: locationArray, name, details
                }});

            const isValidStartDate = moment(start_date, 'YYYY-MM-DD').isValid();
            const isValidEndDate = moment(end_date, 'YYYY-MM-DD').isValid();

            if (!isValidStartDate $$ !isValidEndDate) {
                throw HttpError(422, 'Wrong date format or invalid date');
            }

            const data = await Calendar.create({
                day,
                start_time: timesArray[0],
                end_time: timesArray[1],
                user_id: userId,
            });

            res.json({
                status: 'ok',
                data,
            })
        } catch (e) {
            next(e)
        }
    };
}

export default EventsController;
