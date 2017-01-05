const isDev = process.env.NODE_ENV === 'development';

// Production URL TBD
export const SERVER_URI = isDev ?
    '//tuc-tpl.herokuapp.com/':
    '//tuc-tpl.herokuapp.com/';