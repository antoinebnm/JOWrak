const express = require("express");
const api = express.Router();
require("dotenv").config();

api.use("/:id?", async (req, res) => {
  if (req.method == "GET") {
    if (req.session[req.params?.id])
      res.status(200).json(req.session[req.params.id]);
    else res.status(200).json(req.session);
  } else if (req.method == "POST") {
    if (!req.body)
      res.status(400).json({ error: "The request body is missing." });
    else {
      if (req.params?.id) {
        req.session[req.params.id] = req.body;
        res.status(200).json({ message: "Session data added." });
      } else
        res.status(400).json({ error: "The request section ID is missing." });
    }
  } else if (req.method == "DELETE") {
    if (req.session[req.params.id]) {
      req.session[req.params.id] = null;
      res.status(200).json({ message: "Session data removed." });
    } else
      res
        .status(400)
        .json({ error: "The request section ID is missing or invalid." });
  } else res.status(400).json({ error: "Request method unavailable" });
});

module.exports = api;
