const searchRouter = require("express").Router();
const Record = require("../models/Record");
const { PERFORMANCE_LIMIT } = require("../utils/config");

const { validateAdvancedQuery, validateSimpleQuery } = require("../utils/queryValidator");

// TODO: pagination

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
                return { title: 1 };
            case "alphapeticaldesc":
                return { title: 1 };
        }
    })();

    const firstTime = process.hrtime();

    try {
        let readyQuery = !!query ?
            simple ? validateSimpleQuery(query) : validateAdvancedQuery(query)
            : {};
        console.log("ready query", readyQuery);
        const result = await Record
            .find(readyQuery, { title: 1, author: 1, contentType: 1, year: 1, previewText: 1, image: 1 })
            .sort(sortObject)
            .skip(searchResultsPerPage * page)
            .limit(searchResultsPerPage);

        if (!result) res.status(404).end();
        else {
            const found = await Record.countDocuments(readyQuery).then(number => number);
            console.log("found", found, result);

            let filters = null;

            console.log("found", found, "PERFORMANCE_LIMIT", PERFORMANCE_LIMIT);

            // TODO: preformance_limit to config
            // TODO: classification? maybe not
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