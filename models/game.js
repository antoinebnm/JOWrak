const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["wordle", "typeSpeed"], // wordle: find the word game / typeSpeed: fast typo game
      default: "typeSpeed",
    },
    score: { type: Number, required: true, default: 0 },
    playedBy: { type: Schema.Types.ObjectId, ref: "User" },
    playedAt: { type: Date, required: true },
    won: { type: Boolean },
    playTime: { type: Number },
  },
  { versionKey: false }
);

/**
gameSchema.pre("findOneAndDelete", async function (next) {
  const game = await this.model.findOne(this.getFilter());
  if (game) {
    await User.updateOne(
      { _id: game.playedBy },
      { $pull: { gamesPlayed: game._id } }
    );
  }
  next();
});
 */

// Export model
module.exports = mongoose.model("Game", gameSchema);
