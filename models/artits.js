const { Schema, model } = require("mongoose");

const ArtistSchema = Schema({
  user: { type: Schema.ObjectId, ref: "User" },
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String, default: "default.png" },
  created_at: { type: Date, default: Date.now },
});

module.exports = model("Artist", ArtistSchema, "artists");
