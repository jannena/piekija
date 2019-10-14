const searchRouter = require("express").Router();
const Record = require("../models/Record");

const { validateAdvancedQuery, validateSimpleQuery } = require("../utils/queryValidator");

// TODO: pagination

const searchResultsPerPage = 20;

const search = async (req, res, next, simple) => {
    const { query, page: p, sort } = req.body;
    if (!query) return res.status(401).json({ error: "query is missing" });

    const page = Number(p) - 1 || 0

    const firstTime = process.hrtime();

    try {
        const readyQuery = simple ? validateAdvancedQuery(validateSimpleQuery(query)) : validateAdvancedQuery(query);
        console.log("ready query", readyQuery);
        const result = await Record
            .find(readyQuery, { title: 1, author: 1, contentType: 1, year: 1 })
            .skip(searchResultsPerPage * page)
            .limit(searchResultsPerPage);

        if (!result) res.status(404).json({ error: "no results" });
        else {
            const found = await Record.countDocuments(readyQuery).then(number => number);
            console.log("found", found, result);

            const secondTime = process.hrtime(firstTime);

            res.json({ result, found, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6 });
        }

        // console.log(`${simple ? "simple" : "advanced"} search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
    } catch (err) {
        next(err);
    }
};

// TODO: This implementation does not support AND and OR operators :(
// TODO: Do at least "must contain" opinion
const simpleSearch = async (req, res, next) => {
    const { query, page: p, sort } = req.body;
    if (!query) return res.status(401).json({ error: "query is missing" });

    const page = Number(p) - 1 || 0

    const firstTime = process.hrtime();

    try {
        const allwords = query.split(" ");

        const result = await Record.aggregate([
            { $match: { $or: [{ "spelling1": { "$in": allwords } }, { "spelling2": { "$in": allwords } }] } },
            { $unwind: "$spelling1" },
            // { $unwind: "$spelling2" },
            // { $match: { "spelling1": { "$in": allwords } } },
            { $match: { $or: [{ "spelling1": { "$in": allwords } }, { "spelling2": { "$in": allwords } }] } },
            {
                /* TODO: Now the record with more spelling2 things is ranked better. */
                $group: {
                    id: { $first: "$_id" }, title: { $first: "$title" }, year: { $first: "$year" }, author: { $first: "$author" },
                    _id: "$_id",
                    numRelTags: {
                        $sum: {
                            $cond: {
                                if: { $not: { $in: ["$spelling1", allwords] } },
                                then: 0,
                                else: 1
                            }
                        },

                    }
                }
            },
            { $sort: { numRelTags: -1 } }
        ]);

        /* const readyQuery = validateAdvancedQuery(validateSimpleQuery(query));
        console.log("ready query", readyQuery);
        const result = await Record
            .find(readyQuery, { title: 1, author: 1, contentType: 1, year: 1 })
            
            .skip(searchResultsPerPage * page)
            .limit(searchResultsPerPage); */

        if (!result) res.status(404).json({ error: "no results" });
        else {
            // const found = await Record.countDocuments(readyQuery).then(number => number);
            console.log("found", /* found, */ result);

            const secondTime = process.hrtime(firstTime);

            res.json({ result, found: 200, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6 });
        }

        // console.log(`${simple ? "simple" : "advanced"} search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
    } catch (err) {
        next(err);
    }
};

searchRouter.post("/simple", async (req, res, next) => await simpleSearch(req, res, next, true));
searchRouter.post("/advanced", async (req, res, next) => await search(req, res, next, false));

module.exports = searchRouter;