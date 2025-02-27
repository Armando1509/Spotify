const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  nick: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "role_user",select: false },
  image: { type: String, default: "default.png" },
  created_at: { type: Date, default: Date.now },
});

module.exports = model("User", UserSchema, "users");
