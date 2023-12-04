import HttpError from "http-errors";
import messages from "./messages.js";

export default function validate({values, schema, lang = 'en'}) {
    const {error} = schema.validate(values, { abortEarly: false, messages, errors: {language: lang, wrap: {label: false}}});

    if (error) {
        const errorDetails = error.details.reduce((acc, detail) => {
            acc[detail.path[0]] = detail.message;
            return acc;
        }, {});
        throw HttpError(422, {errors: errorDetails});
    }
}
