const searchRouter = require("express").Router();
const Record = require("../models/Record");
const { PERFORMANCE_LIMIT } = require("../utils/config");

const { validateAdvancedQuery, validateSimpleQuery, queryContainsOps } = require("../utils/queryValidator");


const searchResultsPerPage = 20;

const search = async (req, res, next, simple) => {
    const { query, page: p, sort, filter } = req.body;
    // if (!query) //return res.status(401).json({ error: "query is missing" });

    const page = Number(p) - 1 || 0

    // TODO: sorting (also alphapetical?)
    const sortObject = (() => {
        switch (sort) {
            case "year":
            case "relevance":
                return { year: -1 };
            case "yeardesc":
                return { year: 1 };
            case "timeAdded":
                return { _id: -1 };
            case "alphapetical":
                return { alphabetizableTitle: 1 };
            case "alphapeticaldesc":
                return { alphabetizableTitle: -1 };
        }
    })();

    const firstTime = process.hrtime();

    try {
        let readyQuery = !!query ?
            simple ? validateSimpleQuery(query) : validateAdvancedQuery(query)
            : {};
        console.log("ready query", readyQuery);
        const found = await Record.countDocuments(readyQuery).then(number => number);

        if (!found) {
            const secondTime = process.hrtime(firstTime);
            res.json({ result: [], found: 0, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6, filters: null });
        }
        else {
            const result = Object.keys(readyQuery).length !== 0 && !queryContainsOps(query) && found <= PERFORMANCE_LIMIT && simple === true && sort === "relevance"
                // Relevance search
                // TODO: Add pagination
                ? void (allwords = query.split(" ").map(w => w.toLowerCase())) || await Record.aggregate([
                    { $match: { $or: [{ "spelling1": { "$in": allwords } }, { "spelling2": { "$in": allwords } }] } },
                    { $unwind: "$spelling1" },
                    // { $unwind: "$spelling2" },
                    // { $match: { "spelling1": { "$in": allwords } } },
                    { $match: { $or: [{ "spelling1": { "$in": allwords } }, { "spelling2": { "$in": allwords } }] } },
                    {
                        $group: {
                            id: { $first: "$_id" }, title: { $first: "$title" }, year: { $first: "$year" },
                            author: { $first: "$author" }, image: { $first: "$image" }, contentType: { $first: "$contentType" },
                            previewText: { $addToSet: "$previewText" },
                            _id: "$_id",
                            relevance: {
                                $sum: {
                                    $cond: {
                                        if: { $not: { $in: ["$spelling1", allwords] } },
                                        then: 0,
                                        else: 1
                                    }
                                }
                            }
                        }
                    },
                    { $unwind: "$previewText" },
                    // { $project: { _id: 0, id: 1, title: 1, year: 1, author: 1, image: 1, contentType: 1, previewText: "$_id", } },
                    { $sort: { relevance: -1 } }
                ])
                //
                : await Record
                    .find(readyQuery, { title: 1, author: 1, contentType: 1, year: 1, previewText: 1, image: 1 })
                    .sort(sortObject)
                    .skip(searchResultsPerPage * page)
                    .limit(searchResultsPerPage)

            console.log("found", found, result);

            let filters = null;

            console.log("found", found, "PERFORMANCE_LIMIT", PERFORMANCE_LIMIT);

            if (filter && found < PERFORMANCE_LIMIT) {
                const subjects = await Record.aggregate([
                    { $match: readyQuery },
                    { $unwind: "$subjects" },
                    { $sortByCount: "$subjects" },
                    { $limit: 100 }
                ]);
                const authors = await Record.aggregate([
                    { $match: readyQuery },
                    { $unwind: "$authors" },
                    { $sortByCount: "$authors" },
                    { $limit: 100 }
                ]);
                const years = await Record.aggregate([
                    { $match: readyQuery },
                    { $sortByCount: "$year" },
                    { $limit: 100 }
                ]);
                const languages = await Record.aggregate([
                    { $match: readyQuery },
                    { $unwind: "$languages" },
                    { $sortByCount: "$languages" },
                    { $limit: 100 }
                ]);

                filters = {
                    subjects,
                    authors,
                    years,
                    languages
                };
            }

            const secondTime = process.hrtime(firstTime);

            res.json({ result, found, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6, filters });
        }

        // console.log(`${simple ? "simple" : "advanced"} search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
    } catch (err) {
        next(err);
    }
};

// searchRouter.post("/simple", async (req, res, next) => await simpleSearch(req, res, next, true));
searchRouter.post("/simple", async (req, res, next) => await search(req, res, next, true));
searchRouter.post("/advanced", async (req, res, next) => await search(req, res, next, false));

module.exports = searchRouter;