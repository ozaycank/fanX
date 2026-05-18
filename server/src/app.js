const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const errorHandler = require("./middlewares/error.middleware");

const tweetRoutes = require("./routes/tweet.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const feedbackRoutes = require("./routes/feedback.routes");
const messageRoutes = require("./routes/message.routes");
const reportRoutes = require("./routes/reports.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// Global Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// API Endpointleri
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
// 404 Handler (Eğer yukarıdaki hiçbir rotaya eşleşmezse)
app.use((req, res) => res.status(404).json({ message: "Yol bulunamadı 🏟️" }));

// Merkezi Hata Yönetimi (En altta kalmalı)
app.use(errorHandler);

module.exports = app;
