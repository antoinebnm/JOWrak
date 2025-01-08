const express = require("express");
const api = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
const getHeader = require("../middlewares/getHeader");
require("dotenv").config();

api.use("/games", async (req, res, next) => {
  // protected route, is exe admin ?
  // no tests for now / todo: tests
  next();
});

api.post("/games/create", async (req, res, next) => {
  try {
    if (!req.headers?.gamedetails) {
      throw new Error("No game details headers found.");
    }

    try {
      // Parse the GameDetails header
      const { _type, _score, _playedBy, _playedAt } = JSON.parse(
        req.headers?.gamedetails
      );

      // Convert `_score` to an integer
      const score = parseInt(_score, 10);
      if (isNaN(score)) {
        return res
          .status(400)
          .json({ error: "Invalid score: must be an integer" });
      }

      let playedBy;
      if (_playedBy == "null") {
        playedBy = "0".repeat(24);
      }
      playedBy = await User.findById(playedBy);

      // Convert `_playedAt` to a Date object
      let playedAt;
      if (_playedAt == "null") {
        playedAt = new Date();
      } else {
        playedAt = new Date(_playedAt);
      }
      if (isNaN(playedAt.getTime())) {
        return res.status(400).json({
          error: "Invalid date: must be a valid ISO string or timestamp",
        });
      }

      // Construct the new game object
      const newGame = new Game({
        type: _type,
        score: score,
        playedBy: playedBy._id,
        playedAt: playedAt,
      });

      await newGame.save();

      res.status(200).json(newGame);
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Invalid GameDetails header format" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

api.post("/games/read/:id", async (req, res, next) => {
  try {
    if (await User.findOne({ _id: req.params.id })) {
      res
        .status(200)
        .json(await User.findOne({ _id: req.params.id }, { gamesPlayed }));
    } else {
      res.status(200).json(await Game.findOne({ _id: req.params.id }));
    }
  } catch (error) {
    res.status(error).json({ error: "Error when retrieving data" });
  }
});

api.post("/games/update/:id", async (req, res, next) => {
  res.status(200);
});

api.post("/games/delete/:id", async (req, res, next) => {
  try {
    // Find and delete the game
    const game = await Game.findOneAndDelete({ _id: req.params.id });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Update the user's gamesPlayed array to remove the deleted game
    await User.updateOne(
      { _id: game.playedBy },
      { $pull: { gamesPlayed: game._id } }
    );

    res.status(200).json({
      message: `Game (id: ${game._id} | played by: ${game.playedBy}) successfully deleted.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error when processing the request" });
  }
});

module.exports = api;
