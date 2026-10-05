const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { askPolicyAgent } = require("../Ai/graph");

const router = express.Router();

router.post(
  "/chat",
  authMiddleware,
  async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({
          message: "Message is required"
        });
      }

      const answer = await askPolicyAgent(message);

      res.json({
        answer
      });

    } catch (error) {
      console.error("AI Agent error:", error);

      res.status(500).json({
        message: "AI request failed",
        error: error.message
      });
    }
  }
);

module.exports = router;