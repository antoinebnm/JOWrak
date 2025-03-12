const jwtSignCheck = require("./jwtsigncheck");
require("dotenv").config();

const isAuthorized = (req, res, next) => {
  const token = req.session.user?.OAuthToken || req.headers?.authorization;
  if (!token) {
    //res.status(401).send("Authentication required.");
    res.sendFile("../notfound.html", { root: __dirname });
    return;
  }
  if (token == process.env.ADMIN_ACCESS) {
    req.headers["set-cookie"] = "Auth=Server";
    next();
  } else if (jwtSignCheck(token, res)) {
    req.headers["set-cookie"] = `Auth=${req.session.user?.userId}`;
    next();
  } else {
    //res.status(403).send("Invalid token.");
    res.sendFile("../notfound.html", { root: __dirname });
    return;
  }
};

module.exports = isAuthorized;
