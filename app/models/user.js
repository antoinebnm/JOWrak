const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    displayName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 20,
    },
    credentials: {
      login: { type: String, unique: true, required: true },
      password: { type: String, required: true },
    },
    addedAt: { type: Date, required: true },
  },
  { versionKey: false }
);

// Export model
module.exports = mongoose.model("User", userSchema);
