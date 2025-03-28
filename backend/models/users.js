const mongoose = require("mongoose");
const { profileDB } = require("../db");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    verified: { type: Boolean, default: false },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    team: {
      type: String,
      default: "user", // No team by default
    },
    role: {
      type: String,
      default: "user", // Default to "user"
    },
    report: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
    homepageTour: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
    profileEvaluatorTour: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
    getStartedTour: {
      type: String,
      enum: ["completed", "pending"],
      default: "pending",
    },
    papers: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true }
);
const Users = profileDB.model("Users", userSchema);
module.exports = Users;
