const { verifyToken } = require("../../utils/jwt")

exports.userAuthMiddleware = (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"
        if (!token) {
            return res.status(401).json({ message: "No token provided." });
        }

        // Verify the token
        const { valid, error, decoded } = verifyToken(token, process.env.JWT_SECRET);
        if (valid) {
            req.user = decoded;
            next();
        } else {
            res.status(401).json({ message: error || "Invalid token." });
        }

    } catch (error) {
        // Handle any errors during token verification
        return res.status(403).json({ message: "Invalid token." });
    }

}

exports.adminAuthMiddleware = (req, res, next) => {

    try {
        const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"
        if (!token) {
            return res.status(401).json({ message: "No token provided." });
        }

        // Verify the token
        const { valid, error, decoded } = verifyToken(token, process.env.JWT_ADMIN_SECRET);
        if (valid) {
            req.user = decoded;
            next();
        } else {
            res.status(401).json({ message: error || "Invalid token." });
        }

    } catch (error) {
        // Handle any errors during token verification
        return res.status(403).json({ message: "Invalid token." });
    }

}