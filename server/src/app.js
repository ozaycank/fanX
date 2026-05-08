const express = require("express");
const cors = require("cors");

// Route importları
const tweetRoutes = require("./routes/tweet.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Middleware
app.use(cors()); // Frontend'den gelen isteklere izin ver
app.use(express.json()); // JSON body parse et

// Endpointler
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);

module.exports = app;
