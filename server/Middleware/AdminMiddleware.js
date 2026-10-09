const adminMiddleware = (req, res, next) => {

    // AuthMiddleware must run before this Middleware
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    // Check user role
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admin only"
        });
    }

    // User is an admin
    next();
};

module.exports = adminMiddleware;