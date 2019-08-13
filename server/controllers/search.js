const searchRouter = require("express").Router();
const Record = require("../models/Record");

const { validateAdvancedQuery, validateSimpleQuery } = require("../utils/queryValidator");

// TODO: pagination
// TODO: Search controller does not need to return this much data (ie. full document)

const searchResultsPerPage = 3;

searchRouter.post("/simple", (req, res, next) => {
    const { query, page } = req.body;
    if (!query) return res.status(401).json({ error: "query is missing" });

    const firstTime = process.hrtime();

    console.log({
        record: {
            $regex: query,
            $options: "i"
        }
    });

    Record
        .find(validateAdvancedQuery(validateSimpleQuery(query)))
        .skip(searchResultsPerPage * (Number(page) - 1 || 0))
        .limit(searchResultsPerPage)
        .then(result => {
            if (!result) res.status(404).json({ error: "no results" });
            else res.json(result);

            const secondTime = process.hrtime(firstTime);
            console.log(`simple search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
        })
        .catch(next);
});

searchRouter.post("/advanced", (req, res, next) => {
    const { query, page } = req.body;
    if (!query) return res.status(401).json({ error: "query is missing" });

    const firstTime = process.hrtime();

    Record
        .find(validateAdvancedQuery(query))
        .skip(searchResultsPerPage * (Number(page) - 1 || 0))
        .limit(searchResultsPerPage)
        .then(result => {
            if (!result) res.status(404).json({ error: "no results" });
            else res.json(result);

            const secondTime = process.hrtime(firstTime);
            console.log(`advanced search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
        })
        .catch(next);
});

module.exports = searchRouter;