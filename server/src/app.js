const express = require("express");
const cors = require("cors");
const helmet = require("helmet"); // Güvenlik için
const morgan = require("morgan"); // Loglama için
const errorHandler = require("./middlewares/error.middleware");

const tweetRoutes = require("./routes/tweet.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const messageRoutes = require("./routes/message.routes");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Endpointler
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/messages", messageRoutes);

// 404 Handler
app.use((req, res) => res.status(404).json({ message: "Yol bulunamadı 🏟️" }));

// Merkezi Hata Yönetimi
app.use(errorHandler);

module.exports = app;
