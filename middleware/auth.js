const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        let onlyToken = token.split(' ')[1]
        var decoded = jwt.verify(onlyToken, process.env.JWT_SECRET);
        var userId = decoded.id
        if (req.body.userId && req.body.userId !== userId) {
            throw 'Invalid user ID';
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: 'Invalid request!'
        });
    }
};