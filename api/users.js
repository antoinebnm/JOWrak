const express = require("express");
const api = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Game = require("../models/Game");
require("dotenv").config();

api.use("/users", async (req, res, next) => {
  // protected route, is exe admin ?
  // no tests for now / todo: tests
  next();
});

api.post("/users/create", async (req, res, next) => {
  try {
    console.log("CREATE " + req.headers);
    const login = req.headers.login;
    const password = req.headers.password;
    const username = req.headers.displayname;

    if (!login || !password || !username) {
      throw new Error("Missing Authenticate Header");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      displayName: username,
      credentials: { login: login, password: hashedPassword },
      addedAt: new Date(),
      gamesPlayed: [],
    });

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
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

api.post("/users/delete/:id", async (req, res, next) => {
  try {
    await User.findOneAndDelete({ _id: req.params.id }).then((user) => {
      res.status(200).json({
        message: `User (id: ${user._id} | name: ${user.displayName}) successfully deleted.`,
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Error when retrieving data" });
  }
});

module.exports = api;
