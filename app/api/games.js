const express = require("express");
const api = express.Router();
const User = require("../models/User");
const Game = require("../models/Game");
require("dotenv").config();

api.post("/", async (req, res, next) => {
  if (!req.body?.gameDetails) {
    return res.status(400).json({ error: "No game details found." });
  }
  try {
    //console.log(req.body.gameDetails);
    // Parse the GameDetails
    const { _type, _score, _playedBy, _playedAt } = req.body.gameDetails;

    // Convert `_score` to an integer
    const score = parseInt(_score, 10);
    //console.log(score);
    if (isNaN(score)) {
      return res
        .status(400)
        .json({ error: "Invalid score: must be an integer" });
    }

    const player = await User.findById(_playedBy);

    // Convert `_playedAt` to a Date object
    let playedAt;
    if (_playedAt == "null") playedAt = new Date();
    else playedAt = new Date(_playedAt);

    if (isNaN(playedAt.getTime())) {
      return res.status(400).json({
        error: "Invalid date: must be a valid ISO string or timestamp",
      });
    }

    // Construct the new game object
    const newGame = new Game({
      type: _type,
      score: score,
      playedBy: player._id,
      playedAt: playedAt,
    });

    await newGame.save();

    res.status(201).json(newGame);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

/**
 *
 * TODO: opti -> search par arg user/game plutot que id
 */
api.get("/:id?", async (req, res, next) => {
  try {
    const gameDoc = await Game.findOne({ _id: req.params.id });
    if (gameDoc) res.status(200).json(gameDoc);
    else
      res
        .status(200)
        .json(await Game.find({}).populate("playedBy", "displayName").exec());
  } catch (error) {
    res.status(error.status).json({ error });
  }
});

api.put("/:id", async (req, res, next) => {
  if (!req.body?.updateData) {
    return res.status(400).json({ error: "No update data found." });
  }
  try {
    const { attribute, value } = req.body.updateData;
    await Game.findOneAndUpdate(
      { _id: req.params.id },
      { [attribute]: value },
      { returnOriginal: false }
    ).then(() => {
      res.status(200).json({ message: "User document updated" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json();
  }
});

api.delete("/:id", async (req, res, next) => {
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
