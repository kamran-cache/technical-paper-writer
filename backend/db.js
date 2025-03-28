const mongoose = require("mongoose");
const profile = process.env.DB + "profile";
const paper = process.env.DB + "paper";

const profileDB = mongoose.createConnection(profile);

const paperDB = mongoose.createConnection(paper);

profileDB.once("open", () => console.log("Connected to Profile Database"));
paperDB.once("open", () => console.log("Connected to paper Database"));

profileDB.on("error", (err) =>
  console.log("Error connecting profile databse", err)
);
paperDB.on("error", (err) =>
  console.log("Error connecting paper databse", err)
);

module.exports = { profileDB, paperDB };
