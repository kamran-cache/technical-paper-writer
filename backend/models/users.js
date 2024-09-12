const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    papers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Papers" },
    ] /*here i have taken arrat so that one person can have  multiple resumes. */,
  },
  { timestamps: true }
);
const Users = mongoose.model("Users", userSchema);
module.exports = Users;
