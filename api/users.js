const express = require("express");
const api = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const jwtSignCheck = require("../middlewares/jwtsigncheck");
require("dotenv").config();

api.use("/users", async (req, res, next) => {
  // protected route, is exe admin ?
  // no tests for now / todo: tests
  next();
});

api.post("/users/read/:id", async (req, res, next) => {
  try {
    if (req.params.id == "all") {
      const users = await User.find(); // Trouve les users
      res.status(200).json(users);
    } else if (await User.findOne({ _id: req.params.id })) {
      res.status(200).json(await User.findOne({ _id: req.params.id }));
    } else {
      const user = await User.findOne({
        "credentials.login": req.params.id,
      });
      if (req.params.attribute === undefined) {
        res.status(400).json({ error: "Bad request" });
      } else if (user.credentials.password == req.params.attribute) {
        res.status(200).json(user._id);
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Error when retrieving data" });
  }
});

api.post("/users/update", async (req, res, next) => {
  try {
    const userId = req.headers.userId;
    const setting = req.headers.setting;
    const changedValue = req.headers.changedValue;

    if (setting == "gamesPlayed") {
      let gamesHistory = await User.findOne({
        _id: userId,
      }).get("gamesPlayed");
      const newGame = await Game.findById(changedValue);
      gamesHistory.push(newGame);
      await User.updateOne(
        { _id: userId },
        {
          $set: { gamesPlayed: gamesHistory },
        }
      );
    }

    await User.findOneAndUpdate(
      { _id: userId },
      { [setting]: changedValue },
      { returnOriginal: false }
    ).then(() => {
      res.status(200).json({ message: "User document updated" });
    });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: "Bad request" });
  }
});

api.post("/users/delete", async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: `User (id number ${req.params.id}) successfully deleted.`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error when retrieving data" });
  }
});

// API for user score fetch
api.use("/users/scoreboard/:gameType?/:filtre?", async (req, res, next) => {
  const gameType = req.params.gameType || "chrono";
  const filter = req.params.filtre || "reverse";
  console.log(`Game: ${gameType} | Filter: ${filter}`);
  try {
    switch (filter) {
      case "reverse":
        //users.sort({ userScore: -1 });
        break;

      default:
        break;
    }
    //res.json(users); // Renvoie les utilisateurs en format JSON
  } catch (error) {
    res.status(500).json({ error: "Error when retrieving data" });
  }
});

module.exports = api;
