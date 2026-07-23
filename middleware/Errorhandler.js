// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    console.log("Error:", err);

    let status = err.status || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "ValidationError") {
        status = 400;
        const messages = Object.values(err.errors).map(e => e.message);
        message = messages.join(", ");
    }

    if (err.code === 11000) {
        status = 400;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field} already exists`;
    }

    if (err.name === "JsonWebTokenError") {
        status = 401;
        message = "Invalid token";
    }

    if (err.name === "TokenExpiredError") {
        status = 401;
        message = "Token expired";
    }

    if (err.name === "CastError") {
        status = 400;
        message = "Invalid ID format";
    }

    res.status(status).json({
        success: false,
        message: message,
        error: process.env.NODE_ENV === "development" ? err : {}
    });
};

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export { asyncHandler, errorHandler };
