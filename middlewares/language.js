export default function language(req, res, next){
  try {
    let lang = 'en';
    if (req.headers.language) lang = req.headers.language;

    req.lang = lang;
    next();
  }catch (e){
    next(e)
  }
}
