import multer from "multer";
import HttpError from "http-errors";
import {generateImagePath} from "../helpers/index.js";

const upload = (mimTypes = []) => {
    return multer({
        storage: multer.diskStorage({
            filename: (req, file, cb) => {
                cb(null, generateImagePath(file.mimetype))
            },
        }),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, cb) => {
            if (mimTypes.includes(file.mimetype)) {
                cb(null, true)
            } else {
                cb(HttpError(422, 'Invalid file type'))
            }
        },
    });
}

export default upload;