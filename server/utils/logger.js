
const LOG = process.env.LOG === "false" ? false : true;

const log = (...logs) => {
    if (LOG) console.log(...logs);
};

module.exports = {
    log
};