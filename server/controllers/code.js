const router = require("express").Router();

const Code = require("../models/Code");

router.post("/giveme", async (req, res, next) => {
    const { giveMe } = req.body;

    try {
        return res.json({ iReturn: (await Code.findOneAndDelete({ giveMe })).iReturn });
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;