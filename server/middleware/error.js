
const errorHandler = (error, req, res, next) => {
    switch (error.name) {
        case "JsonWebTokenError": return res.status(401).json({ error: "invalid token" });
        case "CastError": return res.status(400).json({ error: "malformatted id" })
        default: res.status(500).json({ error: `${error.name}: ${error.message}` });
    }

    next();
};

module.exports = errorHandler;