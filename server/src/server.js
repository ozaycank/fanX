require("dotenv").config();
const app = require("./app");
const { connectRedis } = require("./utils/redis");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectRedis();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🏆`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
