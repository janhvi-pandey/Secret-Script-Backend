const jwt = require('jsonwebtoken');
const key = process.env.SECRET_KEY;

const userdetails = (req, res, next) => {
    const token = req.header('token');
    if (!token) return res.status(401).send({ auth: false, message: 'No Token Provided' })
    try {
        const decoded = jwt.verify(token, key);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).send({ auth: false, message: 'Failed to authenticate token.' })
    }
}

module.exports = userdetails;