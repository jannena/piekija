require('dotenv').config();

const DATABASE_URI = process.env.DATABASE_URI;
const PORT = process.env.PORT;

module.exports = {
    DATABASE_URI,
    PORT
};