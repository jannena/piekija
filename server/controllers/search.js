const searchRouter = require("express").Router();
const Record = require("../models/Record");

const { validateAdvancedQuery, validateSimpleQuery } = require("../utils/queryValidator");

// TODO: pagination
// TODO: Search controller does not need to return this much data (ie. full document)

const searchResultsPerPage = 3;

// TODO: Combine these two things.
searchRouter.post("/simple", async (req, res, next) => {
    const { query, page: p, order } = req.body;
    if (!query) return res.status(401).json({ error: "query is missing" });

    const page = Number(p) - 1 || 0

    const firstTime = process.hrtime();

    console.log({
        record: {
            $regex: query,
            $options: "i"
        }
    });

    try {
        const readyQuery = validateAdvancedQuery(validateSimpleQuery(query));
        console.log(readyQuery);
        const result = await Record
            .find(readyQuery)
            .skip(searchResultsPerPage * page)
            .limit(searchResultsPerPage);

        if (!result) res.status(404).json({ error: "no results" });
        else {
            const found = await Record.countDocuments(readyQuery).then(number => number);
            console.log("found", found, result);

            const secondTime = process.hrtime(firstTime);

            res.json({ result, found, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6 });
        }
        console.log(`simple search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
    } catch (err) {
        next(err);
    }
});

searchRouter.post("/advanced", async (req, res, next) => {
    const { query, page: p, order } = req.body;
    if (!query) return res.status(401).json({ error: "query is missing" });

    const page = Number(p) - 1 || 0;

    const firstTime = process.hrtime();

    try {
        const readyQuery = validateAdvancedQuery(query);
        console.log(readyQuery);
        const result = await Record
            .find(readyQuery)
            .skip(searchResultsPerPage * page)
            .limit(searchResultsPerPage);

        if (!result) res.status(404).json({ error: "no results" });
        else {
            const found = await Record.countDocuments(readyQuery).then(number => number);
            console.log("found", found);
            res.json({ result, found });
        }

        const secondTime = process.hrtime(firstTime);
        console.log(`simple search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
    } catch (err) {
        next(err);
    }
});

module.exports = searchRouter;