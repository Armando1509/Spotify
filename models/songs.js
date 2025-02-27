const { Schema, model } = require("mongoose");

const SongSchema = Schema({
  album: { type: Schema.ObjectId, ref: "Album" },
  track: { type: Number, required: true },
  name: { type: String, required: true },
  duration: { type: String, required: true },
  file: { type: String, default: ".mp3" },
  create_at: { type: Date, default: Date.now },
});

module.exports = model("Song", SongSchema, "songs");
