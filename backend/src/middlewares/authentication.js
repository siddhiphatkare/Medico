const jwt = require("jsonwebtoken")

function verifyAccessToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(403).json({
            message: "Authorization header missing",
            error: "Forbidden",
            data: null
        })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(403).json({
            message: "Token missing",
            error: "Forbidden",
            data: null
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.userEmail = decoded.email
        req.userRole = decoded.role
        next()
    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token",
            error: error.message,
            data: null
        })
    }
}

function checkIsPatient(req, res, next) {
    if (req.userRole !== "patient") {
        return res.status(403).json({
            message: "Access denied: Only patients allowed",
            error: "Forbidden",
            data: null
        })
    }
    next()
}

module.exports = {
    verifyAccessToken,
    checkIsPatient
}
