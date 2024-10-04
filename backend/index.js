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
const corsOptions = {
  origin: "http://http://54.84.234.156/", // Adjust this to match your frontend URL
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
};

app.use(cors(corsOptions));
// routes
const paperRoutes = require("./router/paper");
const userRoutes = require("./router/user");
const pdfRoutes = require("./router/pdfRouter");
const openaiRoutes = require("./router/openaiRouter");

app.use(express.json());
app.use("/api/v1/paper", paperRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/pdf", pdfRoutes);
app.use("/api/v1/openai", openaiRoutes);

// Static files
const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/dist");
app.use(express.static(buildPath));

app.get("/*", function (req, res) {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html"),
    function (err) {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
