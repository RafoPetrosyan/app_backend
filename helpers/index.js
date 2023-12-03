import path from "path";
import ejs from "ejs";
import {v4 as uniqueId} from "uuid";
import locales from "../locales/index.js";
import {sendMail} from "../services/nodemailer.js";
import {mimTypesList} from "../constants/index.js";

export const translate = (message, language) => locales[language][message];

export const generateRandomCode = () => {
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
    }
    return code;
}

export const emailVerification = async (email, verificationCode) => {
    const htmlDirection = path.resolve(path.join('./templates', 'emailVerification.ejs'));
    const html = await ejs.renderFile(htmlDirection, {verificationCode});
    const subject = 'Verify your account';
    await sendMail({email, subject, html});
}

export const generateImagePath = (mimetype) => {
    return `${new Date().toISOString().replace(/:/g, '-')}-${uniqueId()}${mimTypesList[mimetype]}`
}