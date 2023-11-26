import locales from "../locales/index.js";

export const translate = (message, language) => locales[language][message];