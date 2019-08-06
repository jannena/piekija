
const errorHandler = (error, req, res, next) => {
    if (error.name === "JsonWebTokenError") return res.status(401).json({ error: "invalid token" });
    if (error.name === "CastError") return res.status(400).json({ error: "malformatted id" });
    if (error.name === "MongoError" && error.message.includes("duplicate key error")) return res.status(400).json({ error: "something must be unique"  });
    if (error.message === "UNAUTHORIZED") return res.status(401).json({ error: "you must login first" });
    if (error.message === "FORBIDDEN") return res.status(403).json({ error: "you do not have permission to do that" });
    
    res.status(500).json({ error: `${error.name}: ${error.message}` });
    console.log(error);

    next();
};

module.exports = errorHandler;