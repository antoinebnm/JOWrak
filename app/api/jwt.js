const express = require("express");
const api = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

api.get("/:action/:token?", async (req, res, next) => {
  try {
    const r = {};
    switch (req.params.action) {
      case "sign":
        if (req.body) {
          r.data = jwt.sign(req.body, process.env.JWT_SECRET);
        }
        break;

      case "check":
        if (req.params.token) {
          r.data = jwt.verify(req.params.token, process.env.JWT_SECRET);
        }
        break;

      default:
        break;
    }

    res.status(200).send(r.data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = api;
