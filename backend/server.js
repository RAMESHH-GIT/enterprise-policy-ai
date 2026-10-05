require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const policyRoutes = require("./routes/policyRoutes");
const aiRoutes = require("./routes/aiRoutes");
console.log("1. Starting Node...");

const app = express();

console.log("2. Express created");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/ai", aiRoutes);


app.get("/", (req, res) => {
  res.send("Enterprise Policy AI Backend is running");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend is connected"
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`3. Server running on http://localhost:${PORT}`);
  });
};

startServer();