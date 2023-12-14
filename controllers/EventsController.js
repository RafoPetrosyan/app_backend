import Joi from "joi";
import moment from "moment";
import HttpError from "http-errors";
import validate from "../validations/validate.js";
import Calendar from "../models/Calendar.js";
import Categories from "../models/Categories.js";
import Users from "../models/Users.js";
import Events from "../models/Events.js";

class EventsController {
    static createEvent = async (req, res, next) => {
        try {
            const {userId} = req;
            const {start_date, end_date, speaker_id, category_id, longitude, latitude, name, details} = req.body;

            const schema = Joi.object({
                start_date: Joi.date().default(() => moment().format('YYYY-MM-DD')).required(),
                end_date: Joi.date().default(() => moment().format('YYYY-MM-DD')).required(),
                longitude: Joi.string().required(),
                latitude: Joi.string().required(),
                name: Joi.string().required(),
                details: Joi.string().required(),
                category_id: Joi.string().required(),
                speaker_id: Joi.string().required(),
            });
            await validate({schema, values: {
                    start_date, end_date, speaker_id, category_id, longitude, latitude, name, details
                }});

            const isValidStartDate = moment(start_date, 'YYYY-MM-DD').isValid();
            const isValidEndDate = moment(end_date, 'YYYY-MM-DD').isValid();

            if (!isValidStartDate && !isValidEndDate) {
                throw HttpError(422, 'Wrong date format or invalid date');
            }

            const currentUser = await Users.findByPk(userId);
            if (!currentUser) throw HttpError(401, 'Unauthorized request');

            const category = await Categories.findByPk(category_id);
            if (!category) throw HttpError(404, 'Category not found');

            const speaker = await Calendar.findByPk(speaker_id);
            if (!speaker) throw HttpError(404, 'Speaker not found');

            const data = await Events.create({
                start_date: moment(start_date, 'YYYY-MM-DD').format(),
                end_date: moment(end_date, 'YYYY-MM-DD').format(),
                speaker_id: speaker.user_id,
                user_id: userId,
                category_id, longitude, latitude, name, details
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
