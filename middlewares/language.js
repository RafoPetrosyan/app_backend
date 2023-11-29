import HttpError from "http-errors";
import {languages} from "../constants/index.js";

export default function language(req, res, next){
  try {
    let lang = 'en';
    if (req.headers.language) {
      if (!languages.includes(req.headers.language)) {
        throw HttpError(422, 'Incorrect language');
      }
      lang = req.headers.language;
    }

    req.lang = lang;
    next();
  }catch (e){
    next(e)
  }
}
