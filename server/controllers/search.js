const searchRouter = require("express").Router();
const Record = require("../models/Record");

const { validateAdvancedQuery, validateSimpleQuery } = require("../utils/queryValidator");

// TODO: pagination
// TODO: Search controller does not need to return this much data (ie. full document)

const searchResultsPerPage = 20;

const search = async (req, res, next, simple) => {
    const { query, page: p, sort } = req.body;
    if (!query) return res.status(401).json({ error: "query is missing" });

    const page = Number(p) - 1 || 0

    const firstTime = process.hrtime();

    try {
        const readyQuery = simple ? validateAdvancedQuery(validateSimpleQuery(query)) : validateAdvancedQuery(query);
        console.log(readyQuery);
        const result = await Record
            .find(readyQuery, { title: 1, author: 1, contentType: 1, year: 1 })
            .skip(searchResultsPerPage * page)
            .limit(searchResultsPerPage);

        if (!result) res.status(404).json({ error: "no results" });
        else {
            // TODO: Return how many documents match the query
            const found = 10; // await Record.countDocuments(readyQuery).then(number => number);
            console.log("found", found, result);

            const secondTime = process.hrtime(firstTime);

            res.json({ result, found, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6 });
        }

        // console.log(`${simple ? "simple" : "advanced"} search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
    } catch (err) {
        next(err);
    }
};

searchRouter.post("/simple", async (req, res, next) => await search(req, res, next, true));
searchRouter.post("/advanced", async (req, res, next) => await search(req, res, next, false));

module.exports = searchRouter;