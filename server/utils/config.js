require('dotenv').config();


const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const DATABASE_URI = process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URI
    : process.env.DATABASE_URI;
const PERFORMANCE_LIMIT = process.env.PERFORMANCE_LIMIT;

const GOOGLE_LOGIN = process.env.GOOGLE_USE_GOOGLE_LOGIN === "true" ? {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI
} : false;

module.exports = {
    DATABASE_URI,
    PORT,
    SECRET,
    PERFORMANCE_LIMIT,
    GOOGLE_LOGIN
};