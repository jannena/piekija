require('dotenv').config();

const DATABASE_URI = process.env.DATABASE_URI;
const PORT = process.env.PORT;
const SECRET = process.env.SECRET;

module.exports = {
    DATABASE_URI,
    PORT,
    SECRET
};