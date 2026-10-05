
const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    content: {
      type: String,
      required: true
    },

    fileName: {
      type: String
    },

    fileType: {
      type: String
    },

    chunks: [
      {
        text: {
          type: String,
          required: true
        },

        embedding: {
          type: [Number],
          default: []
        }
      }
    ],

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Policy", policySchema);
