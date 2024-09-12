const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const path = require("path");
const bodyParser = require("body-parser");

mongoose
  .connect(process.env.DB)
  .then((con) => {
    console.log("Database connected successfully!!");
  })
  .catch((err) => {
    console.log("Error connecting the database!!", err);
  });
app.use(bodyParser.json({ limit: "100mb" })); // Adjust the limit as needed

// Increase the limit for URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

// routes
const paperRoutes = require("./router/paper");
const userRoutes = require("./router/user");
const pdfRoutes = require("./router/pdfRouter");
const openaiRoutes = require("./router/openaiRouter");

app.use(cors());
app.use(express.json());
app.use("/api/v1/paper", paperRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/pdf", pdfRoutes);
app.use("/api/v1/openai", openaiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
