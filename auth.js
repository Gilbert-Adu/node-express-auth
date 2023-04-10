const jwt = require("jsonwebtoken");

const config = process.env;

function breakdown(temp) {
    pos = temp.lastIndexOf("=");
    return temp.substring(pos + 1);
};
const verifyToken = (req, res, next) => {
    console.log(res);
    const token =  req.headers["x-access-token"] || breakdown(req.headers.cookie) || req.body.token || req.query.token;
    console.log(breakdown(req.headers.cookie));

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;

    }catch(err) {

        return res.status(401).send("Invalid token");
    }

    return next()
};

module.exports = verifyToken;