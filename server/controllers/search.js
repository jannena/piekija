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
        let readyQuery = simple ? validateAdvancedQuery(validateSimpleQuery(query)) : validateAdvancedQuery(query);
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
                { $sortByCount: "$languages" }
            ]);

            const filters = {
                subjects,
                authors,
                years,
                languages
            };

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