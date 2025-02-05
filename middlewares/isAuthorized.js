require("dotenv").config();

const isAuthorized = (req, res, next) => {
  const token = req.headers?.authorization;
  if (!token) {
    //res.status(401).send("Authentication required.");
    res.sendFile("../notfound.html", { root: __dirname });
    return;
  }
  if (token == process.env.ADMIN_ACCESS) {
    console.log("Server Call");
    next();
  } else {
    //res.status(403).send("Invalid token.");
    res.sendFile("../notfound.html", { root: __dirname });
    return;
  }
};

module.exports = isAuthorized;
