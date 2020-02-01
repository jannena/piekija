const loantypeRouter = require("express").Router();
const Loantype = require("../models/Loantype");
const Item = require("../models/Loantype");

loantypeRouter.get("/", (req, res, next) => {
    Loantype
        .find({})
        .then(result => void res.send(result))
        .catch(next);
});

// loantypeRouter.get("/:id", (req, res, next) => {
//     const id = req.params.id;

//     Loantype
//         .findById(id)
//         .then(result => {
//             if (result) return res.json(result.toJSON());
//             else res.status(404).end();
//         })
//         .catch(next);
// });

loantypeRouter.post("/", (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

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
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

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

loantypeRouter.delete("/:id", async (req, res, next) => {
    if (!req.authenticated) return next(new Error("UNAUTHORIZED"));
    if (!req.authenticated.staff) return next(new Error("FORBIDDEN"));

    const id = req.params.id;

    try {
        console.log("Trying to remove loantype", id);
        const itemUsingThisLoantype = await Item.findOne({ loantype: id });
        console.log(itemUsingThisLoantype);
        if (itemUsingThisLoantype) return res.status(409).json({ error: "there are items that using this loantype" });
    }
    catch (err) {
        return next(err);
    }

    Loantype
        .findByIdAndRemove(id)
        .then(() => res.status(204).end())
        .catch(next);
});

module.exports = loantypeRouter;