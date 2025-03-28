const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const path = require("path");
const { paperDB, profileDB } = require("./db");

// Database connection
// mongoose
//   .connect(process.env.DB)
//   .then(() => console.log("✅ Database connected successfully!"))
//   .catch((err) => console.log("❌ Error connecting to database:", err));

// Middleware
app.use(express.json({ limit: "100mb" })); // JSON limit
app.use(express.urlencoded({ limit: "100mb", extended: true })); // URL-encoded limit

// CORS Configuration
const corsOptions = {
  origin: [
    "https://tpw.smartimmigrant.ai",
    //  "http://localhost:5173",
    "https://app.smartimmigrant.ai",
  ], // Allow frontend URLs
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
const paperRoutes = require("./router/paper");
const userRoutes = require("./router/user");
const pdfRoutes = require("./router/pdfRouter");
const openaiRoutes = require("./router/openaiRouter");

app.use((req, res, next) => {
  console.log("🔹 Incoming Request:");
  console.log("➡️ Method:", req.method);
  console.log("➡️ URL:", req.originalUrl);
  console.log("➡️ Headers:", req.headers);

  if (req.method !== "GET") {
    console.log("➡️ Body:", req.body); // Only log body for non-GET requests
  }

  next(); // Pass request to next middleware
});

app.use("/api/v1/paper", paperRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/pdf", pdfRoutes);
app.use("/api/v1/openai", openaiRoutes);

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Static files
// const _dirname = path.dirname("");
// const buildPath = path.join(_dirname, "../frontend/dist");
// app.use(express.static(buildPath));

// app.get("/*", function (req, res) {
//   res.sendFile(
//     path.join(__dirname, "../frontend/dist/index.html"),
//     function (err) {
//       if (err) {
//         res.status(500).send(err);
//       }
//     }
//   );
// });
