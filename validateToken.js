const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
    try {
        let token;
        let authHeader = req.headers.Authorization || req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
                if (err) {
                    res.status(401);
                    throw new Error("User is not authorized");
                }
                req.user = decode.user;
                next();
            });
        }
        if (!token) {
            res.status(401);
            throw new Error("User is not authorized/token missing");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = validateToken;
