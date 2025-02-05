const express = require("express");
const session = require("express-session");
const compression = require("compression");
require("dotenv").config();

const createServer = async () => {
  const app = express();
  const sessionManager = session({
    secret: process.env.SESSION_SECRET || "default_secret_abcdef123456",
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1 * 60 * 1000, // 1 minutes
      httpOnly: false,
      secure: false, // mettre à `true` en production si HTTPS est utilisé
    }, // miliseconds * seconds * minutes * hour
  });

  app.use(compression());
  app.use(express.json());
  app.use(sessionManager.create());
  app.use("/api/auth", require("../../api/auth"));
  app.use("/api/games", require("../../api/games"));
  app.use("/api/users", require("../../api/users"));
  app.use("/api/session", require("../../api/session"));

  const PORT = process.env.TEST_PORT || 0;
  const server = app.listen(PORT);
  return { app, server, sessionManager };
};

module.exports = {
  createServer,
};
