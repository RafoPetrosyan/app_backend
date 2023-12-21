import {Op} from 'sequelize';
import moment from "moment";
import Calendar from "../models/Calendar.js";

const deleteCalendarOldData = async () => {
    try {
        const twentyFourHoursAgo = moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm');

        await Calendar.destroy({
            where: {
                day: {
                    [Op.lt]: twentyFourHoursAgo,
                },
            },
        });

        console.log('Old data deleted successfully');
    } catch (error) {
        console.error('Error deleting old data:', error);
    }
};

export default deleteCalendarOldData;
