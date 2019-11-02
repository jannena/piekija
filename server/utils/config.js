require('dotenv').config();


const PORT = process.env.PORT;
const SECRET = process.env.SECRET;
const DATABASE_URI = process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URI
    : process.env.DATABASE_URI;
const PERFORMANCE_LIMIT = process.env.PERFORMANCE_LIMIT;

module.exports = {
    DATABASE_URI,
    PORT,
    SECRET,
    PERFORMANCE_LIMIT
};