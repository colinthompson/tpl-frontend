const isDev = process.env.NODE_ENV === 'development';

// export const SERVER_URI = 'https://tplapp.onrender.com/'; // Production server
// export const SERVER_URI = '//localhost:3001/'; // Development server
export const SERVER_URI = isDev
    ? '//localhost:3001/'
    : 'https://tplapp.onrender.com/';
