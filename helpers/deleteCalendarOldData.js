import {Op} from 'sequelize';
import Calendar from "../models/Calendar.js";

const deleteCalendarOldData = async () => {
    console.log(222)
    try {
        const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60 * 1000);

        await Calendar.destroy({
            where: {
                end_date: {
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
