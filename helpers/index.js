import path from "path";
import ejs from "ejs";
import {v4 as uniqueId} from "uuid";
import fs from "fs";
import locales from "../locales/index.js";
import {sendMail} from "../services/nodemailer.js";
import {mimTypesList} from "../constants/index.js";
import moment from "moment";

const {BASE_URL} = process.env;

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

export const deleteImage = async (image) => {
    if (!image) return;
    const imageUrl = path.resolve(path.join('./public', image.replace(BASE_URL, '')));
    await fs.unlink(imageUrl, (err) => {
        if (err) throw err;
        console.log('successfully');
    });
}

export const checkValidTime = (time) => /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);