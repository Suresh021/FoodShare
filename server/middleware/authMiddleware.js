import jwt from "jsonwebtoken";

const SECRET = "foodshare123";

const verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

const checkRole = (...roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ message: "User not authenticated" });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message: `Access denied. Required roles: ${roles.join(", ")}`
                });
            }

            next();
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Server error" });
        }
    };
};

export { checkRole, verifyToken };
