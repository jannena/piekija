const searchRouter = require("express").Router();
const Record = require("../models/Record");

searchRouter.post("/simple", (req, res) => {
    const query = req.body.query;

    if (!query) return res.status(401).json({ error: "query not given" });

    const firstTime = process.hrtime();

    console.log({
        record: {
            $regex: query,
            $options: "i"
        }
    });

    Record
        .find({
            record: {
                $regex: query,
                $options: "i"
            }
        })
        .then(result => {
            if (!result) res.status(404).json({ error: "no results" });
            else res.json(result);

            const secondTime = process.hrtime(firstTime);
            console.log(`simple search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

searchRouter.post("/advanced", (req, res) => {
    const query = req.body.query;

    // TODO: validation of variable 'query'

    const firstTime = process.hrtime();

    Record
        .find(query)
        .then(result => {
            if (!result) res.status(404).json({ error: "no results" });
            else res.json(result);

            const secondTime = process.hrtime(firstTime);
            console.log(`advanced search time ${(secondTime[0] * 1e9 + secondTime[1]) * 1e-6} ms`);
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
            console.log(err);
        });
});

module.exports = searchRouter;