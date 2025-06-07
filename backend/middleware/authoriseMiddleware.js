const { ObjectId } = require("mongodb");

const authorizeMiddleware = (req, res, next) => {
    // req.user is set by authMiddleware
    const userIdFromToken = req.user.id;
    const userIdFromParams = req.params.id;

    // Compare as strings for safety
    if (userIdFromToken !== userIdFromParams && userIdFromToken !== String(userIdFromParams)) {
        return res.status(403).json({ message: "Forbidden: Not authorized" });
    }
    next();
};

module.exports = authorizeMiddleware;