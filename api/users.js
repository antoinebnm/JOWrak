const express = require("express");
const api = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Game = require("../models/Game");
require("dotenv").config();

api.post("/", async (req, res, next) => {
  if (!req.body?.credentials) {
    return res.status(400).json({ error: "No user credentials found." });
  }
  try {
    const [login, password, username] = Object.values(req.body.credentials);

    if (!login || !password || !username) {
      res.status(400).json({ message: "A credentials is missing (undefined)" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      displayName: username,
      credentials: { login: login, password: hashedPassword },
      addedAt: new Date(),
      gamesPlayed: [],
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

api.get("/:id", async (req, res, next) => {
  try {
    if (req.params.id == "all") {
      const users = await User.find(); // Trouve les users
      res.status(200).json(users);
    } else if (await User.findOne({ _id: req.params.id })) {
      res.status(200).json(await User.findOne({ _id: req.params.id }));
    }
  } catch (error) {
    res.status(500).json({ error: "Error when retrieving data" });
  }
});

api.put("/", async (req, res, next) => {
  if (!req.body?.updateData) {
    return res.status(400).json({ error: "No update data found." });
  }
  try {
    const { userId, attribute, value } = req.body.updateData;

    if (attribute == "gamesPlayed") {
      let gamesHistory = await User.findOne({
        _id: userId,
      }).get("gamesPlayed");

      const storedGame = await Game.findById(value);
      gamesHistory.push(storedGame);

      await User.updateOne(
        { _id: userId },
        {
          $set: { gamesPlayed: gamesHistory },
        }
      );
    } else {
      await User.findOneAndUpdate(
        { _id: userId },
        { [attribute]: value },
        { returnOriginal: false }
      ).then(() => {
        res.status(200).json({ message: "User document updated" });
      });
    }
  } catch (error) {
    res.status(500).json();
  }
});

api.delete("/:id", async (req, res, next) => {
  try {
    if (!req.params.id) res.status(400).json({ error: "User ID is missing." });
    await User.findOneAndDelete({ _id: req.params.id }).then((user) => {
      res.status(200).json({
        message: `User (id: ${user._id} | name: ${user.displayName}) successfully deleted.`,
      });
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = api;
