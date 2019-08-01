const loantypeRouter = require("express").Router();
const Loantype = require("../models/Loantype");

loantypeRouter.get("/", (req, res) => {
    Loantype
        .find({})
        .then(result => void res.send(result))
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

loantypeRouter.post("/", (req, res) => {
    const { name, canBePlacedAHold, canBeLoaned, canBeRenewed, renewTimes, loanTime } = req.body;
    if (!name || !canBePlacedAHold || !canBeLoaned || !canBeRenewed || !renewTimes || !loanTime)
        return res.status(400).json(
            {
                error: "name or canBePlacedAHold or canBeLoaned or canBeRenewed or renewTimes or loanTime is missing"
            }
        );

    const newLoantype = new Loantype({
        name,
        canBePlacedAHold,
        canBeLoaned,
        canBeRenewed,
        renewTimes,
        loanTime
    });
    newLoantype
        .save()
        .then(result => void res.status(201).json(result))
        .catch(err => {
            res.status(500).json({ error: err.message });
            console.log(err);
        });
});

module.exports = loantypeRouter;