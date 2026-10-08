const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {

        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check whether Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided"
            });
        }

        // Expected format:
        // Authorization: Bearer TOKEN
        const [scheme, token] = authHeader.split(" ");

        // Validate Bearer format
        if (scheme !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store decoded information
        // inside request object
        req.user = decoded;

        // Continue
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;