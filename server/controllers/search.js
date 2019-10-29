const searchRouter = require("express").Router();
const Record = require("../models/Record");

const { validateAdvancedQuery, validateSimpleQuery, queryContainsOps } = require("../utils/queryValidator");

// TODO: pagination

const searchResultsPerPage = 20;

const search = async (req, res, next, simple) => {
    const { query, page: p, sort } = req.body;
    if (!query) return res.status(401).json({ error: "query is missing" });

    const page = Number(p) - 1 || 0

    const sortObject = (() => {
        switch (sort) {
            case "year": return { year: -1 };
            case "relevance":
            case "timeAdded":
                return { timeAdded: -1 };
        }
    })();

    const firstTime = process.hrtime();

    try {
        const readyQuery = simple ? validateAdvancedQuery(validateSimpleQuery(query)) : validateAdvancedQuery(query);
        console.log("ready query", readyQuery);
        const result = await Record
            .find(readyQuery, { title: 1, author: 1, contentType: 1, year: 1 })
            // .sort(sortObject)
            .skip(searchResultsPerPage * page)
            .limit(searchResultsPerPage);

        if (!result) res.status(404).end();
        else {
            const found = await Record.countDocuments(readyQuery).then(number => number);
            console.log("found", found, result);

            // TODO: Search for search filters
            const filters = (found <= 10000 && found > 0)
                ? (await Record.aggregate([{
                    $facet: {
                        authors: [
                            { $match: readyQuery },
                            { $unwind: "$authors" },
                            { $sortByCount: "$authors" },
                            { $limit: 100 }
                        ],
                        subjects: [
                            { $match: readyQuery },
                            { $unwind: "$subjects" },
                            { $sortByCount: "$subjects" },
                            { $limit: 100 }
                        ],
                        years: [
                            { $match: readyQuery },
                            { $sortByCount: "$year" },
                            { $limit: 100 }
                        ],
                        languages: [
                            { $match: readyQuery },
                            { $unwind: "$languages" },
                            { $sortByCount: "$languages" }
                        ]
                    }
                }]))[0]
                : null;

            const secondTime = process.hrtime(firstTime);

            res.json({ result, found, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6, filters });
        }

        // console.log(`${simple ? "simple" : "advanced"} search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
    } catch (err) {
        next(err);
    }
};

const simpleSearch = async (req, res, next) => {
    return queryContainsOps(req.body.query)
        ? await search(req, res, next, true)
        : await relevanceSimpleSearch(req, res, next);
};

// TODO: This implementation does not support AND and OR operators :(
// TODO: This implementation uses too much memory :(
const relevanceSimpleSearch = async (req, res, next) => {
    const { query, page: p } = req.body;
    const sort = "timeAdded";
    if (!query) return res.status(401).json({ error: "query is missing" });

    const page = Number(p) - 1 || 0

    const firstTime = process.hrtime();

    try {
        const subquery = [];

        const allwords = [];
        query.toLowerCase().split(" ").map(w => {
            if (w[0] === "+") {
                subquery.push({
                    $or: [

                        { "spelling1": w.substring(1) },
                        { "spelling2": w.substring(1) },
                    ]
                });
                allwords.push(w.substring(1));
            }
            else if (w[0] === "-") {
                subquery.push({
                    $and: [
                        { "spelling1": { $ne: w.substring(1) } },
                        { "spelling2": { $ne: w.substring(1) } },
                    ]
                });
                // allwords.push(w.substring(1));
            }
            else allwords.push(w);
        });

        const query2 = {
            $and: [
                {
                    $or:
                        [
                            ...allwords.map(w => ({ spelling1: w })),
                            ...allwords.map(w => ({ spelling2: w }))
                            /* { "spelling1": { "$in": allwords } },
                            { "spelling2": { "$in": allwords } } */
                        ]
                }
            ]
        };
        if (subquery.length > 0) query2.$and.push(...subquery);

        console.log("New ready query", JSON.stringify(query2));


        const sortObject = ((sort) => {
            switch (sort) {
                case "relevance": return { $sort: { numRelTags: -1 } };
                case "year": return { $sort: { year: -1 } };
                case "timeAdded": return { $sort: { timeAdded: -1 } };
            }
        })("timeAdded");

        /* const result = await Record
            .find(query2, { title: 1, author: 1, contentType: 1, year: 1 })
            .sort({ timeAdded: 1 })
            .skip(searchResultsPerPage * page)
            .limit(searchResultsPerPage); */

        const result = await Record.aggregate([{
            $facet: {
                result: [
                    { $match: query2 },
                    { $limit: searchResultsPerPage },
                    { $project: { title: 1, author: 1, year: 1 } }
                ]/* ,
                count: [
                    { $match: query2 },
                    { $project: { _id: 1 } },
                    { $count: "count" }
                ] */,
                subjects: [
                    { $match: query2 },
                    { $limit: 10000 },
                    { $unwind: "$subjects" },
                    { $sort: { subjects: 1 } },
                    { $group: { _id: "$subjects", count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 100 }
                ]
            }
        }]);

        const count = await Record.countDocuments(query2).then(number => number);


        /* const result = await Record.aggregate(
            sort === "relevance"
                // If sorting by relevance
                ? [{
                    $facet: {
                        result: [
                            { $match: query2 },
                            { $unwind: "$spelling1" },
                            { $match: { $or: [{ "spelling1": { "$in": allwords } }, { "spelling2": { "$in": allwords } }] } },
                            {
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
                            sortObject,
                            { $skip: searchResultsPerPage * page },
                            { $limit: searchResultsPerPage }
                        ],
                        count: [
                            { $match: query2 },
                            { $count: "count" }
                        ]
                    }
                }]
                // If not sorting by relevance but year etc.
                : [{
                    $facet: {
                        result: [
                            { $match: query2 },
                            sortObject,
                            { $skip: searchResultsPerPage * page },
                            { $limit: searchResultsPerPage },
                            {
                                $group: {
                                    id: { $first: "$_id" }, title: { $first: "$title" }, year: { $first: "$year" }, author: { $first: "$author" },
                                    _id: "$_id",
                                }
                            }
                        ],
                        count: [
                            { $match: query2 },
                            { $count: "count" }
                        ]
                    }
                }]
        ); */

        /*$cond: {
            if: { $not: { $in: ["$spelling1", allwords] } },
            then: 0,
            else: 2
        }
        */

        /* const readyQuery = validateAdvancedQuery(validateSimpleQuery(query));
        console.log("ready query", readyQuery);
        const result = await Record
            .find(readyQuery, { title: 1, author: 1, contentType: 1, year: 1 })
            
            .skip(searchResultsPerPage * page)
            .limit(searchResultsPerPage); */

        if (!result) res.status(404).json({ error: "no results" });
        else {
            // const found = await Record.countDocuments(readyQuery).then(number => number);
            // console.log("found", result[0].result, "kpl", result[0].count, "full result", result[0]);

            const secondTime = process.hrtime(firstTime);

            // res.json({ result: result[0].result, found: result[0].count[0].count, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6 });
            res.json({ result: result[0].result, found: count, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6, subjects: result[0].subjects });
            // res.json({ result: result, found: count, time: (secondTime[0] * 1e9 + secondTime[1]) * 1e-6 });
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