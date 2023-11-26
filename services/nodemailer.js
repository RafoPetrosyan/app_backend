import HttpError from "http-errors";
import Nodemailer from "nodemailer";
import _ from "lodash";

const {createTransport} = Nodemailer;
const {NODEMAILER_FROM, NODEMAILER_USER, NODEMAILER_HOST, NODEMAILER_PORT, NODEMAILER_PASSWORD} = process.env;

const transporter = createTransport({
    host: NODEMAILER_HOST,
    port: NODEMAILER_PORT,
    secure: true,
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASSWORD,
    },
});

export async function sendMail({email, subject, html}) {
    try {
        const to = _.isArray(email) ? email.join(', ') : email;
        const data = {
            from: NODEMAILER_FROM,
            to,
            subject,
            html,
        }
        return await transporter.sendMail(data);
    } catch (e) {
        throw new HttpError(500, e.message);
    }
}
