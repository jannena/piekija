const loantypeRouter = require("express").Router();
const Loantype = require("../models/Loantype");

loantypeRouter.get("/", (req, res, next) => {
    Loantype
        .find({})
        .then(result => void res.send(result))
        .catch(next);
});

loantypeRouter.post("/", (req, res, next) => {
    const { name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime } = req.body;
    if (!name || canBePlacedAHold === undefined || canBeLoaned === undefined || renewTimes === undefined || loanTime === undefined)
        return res.status(400).json({ error: "name or canBePlacedAHold or canBeLoaned or renewTimes or loanTime is missing" });

    const newLoantype = new Loantype({
        name,
        canBePlacedAHold,
        canBeLoaned,
        renewTimes,
        loanTime
    });
    newLoantype
        .save()
        .then(result => void res.status(201).json(result))
        .catch(next);
});

loantypeRouter.put("/:id", (req, res, next) => {
    const { id } = req.params;

    const { name, canBePlacedAHold, canBeLoaned, renewTimes, loanTime } = req.body;
    if (!name || canBePlacedAHold === undefined || canBeLoaned === undefined || renewTimes === undefined || loanTime === undefined)
        return res.status(400).json({ error: "name or canBePlacedAHold or canBeLoaned or renewTimes or loanTime is missing" });

    const updatedLoanType = {
        name,
        canBePlacedAHold,
        canBeLoaned,
        renewTimes,
        loanTime
    };
    Loantype
        .findByIdAndUpdate(id, updatedLoanType, { new: true })
        .then(result => res.json(result))
        .catch(next);
});

loantypeRouter.delete("/:id", (req, res, next) => {
    // TODO: Authorization
    const { id } = req.params;

    Loantype
        .findByIdAndRemove(id)
        .then(() => res.status(204).end())
        .catch(next);
});

module.exports = loantypeRouter;