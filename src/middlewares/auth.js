const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.log(token)
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    console.log(process.env.JWT_SECRET_KEY, token)
    try {
        const verify = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!verify) {
            console.log(verify)
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        req.user = verify;
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: err.message });
    }
};
