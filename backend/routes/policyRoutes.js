const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const Policy = require("../models/Policy");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createChunks
} = require("../services/chunkService");
const {
  generateEmbeddings
} = require("../services/embeddingService");
const {
  embeddings
} = require("../Ai/embeddings");

const router = express.Router();
router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const policy = await Policy.findById(
        req.params.id
      );

      if (!policy) {
        return res.status(404).json({
          message: "Policy not found"
        });
      }

      res.json({
        policy
      });

    } catch (error) {
      console.error(
        "Get policy error:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch policy"
      });
    }
  }
);
// Create uploads folder
const uploadDirectory = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true
  });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

// GET POLICIES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const policies = await Policy.find({
      status: "active"
    });

    res.json(policies);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch policies"
    });
  }
});

// CREATE POLICY
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      category,
      content
    } = req.body;

    const policy = await Policy.create({
      title,
      category,
      content
    });

    res.status(201).json(policy);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create policy"
    });
  }
});

// UPLOAD POLICY PDF
router.post(
  "/upload",
  authMiddleware,
  upload.single("policyFile"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "PDF file is required"
        });
      }

      console.log(
        "Uploaded file:",
        req.file.originalname
      );

      const pdfBuffer = fs.readFileSync(
  req.file.path
);

const parser = new PDFParse({
  data: pdfBuffer
});

const pdfData = await parser.getText();

const extractedText = pdfData.text.trim();

await parser.destroy();
const textChunks = createChunks(
  extractedText
);

console.log(
  "Created chunks:",
  textChunks.length
);
      if (!extractedText) {
        return res.status(400).json({
          message: "Could not extract text from PDF"
        });
      }

      // Use filename as title
      const title = path
        .basename(
          req.file.originalname,
          path.extname(req.file.originalname)
        );

      // Save policy in MongoDB
     const policy = await Policy.create({
  title,
  category: "Company Policy",
  content: extractedText,
  fileName: req.file.originalname,
  fileType: req.file.mimetype,

  chunks: textChunks.map((chunk) => ({
    text: chunk
  }))
});

      res.status(201).json({
  message: "Policy PDF uploaded successfully",

  policy: {
    id: policy._id,
    title: policy.title,
    fileName: policy.fileName,
    contentLength: policy.content.length,
    chunkCount: policy.chunks.length
  }
});

    } catch (error) {
  console.error(
    "Policy upload error:",
    error
  );

  res.status(500).json({
    message: "Policy upload failed",
    error: error.message
  });
}
  }
);
// GENERATE POLICY EMBEDDINGS
router.post(
  "/:id/embed",
  authMiddleware,
  async (req, res) => {
    try {
      const policy = await Policy.findById(
        req.params.id
      );

      if (!policy) {
        return res.status(404).json({
          message: "Policy not found"
        });
      }

      if (
        !policy.chunks ||
        policy.chunks.length === 0
      ) {
        return res.status(400).json({
          message: "Policy has no chunks"
        });
      }

      console.log(
        `Generating embeddings for ${policy.chunks.length} chunks...`
      );

      for (
        let start = 0;
        start < policy.chunks.length;
        start += 20
      ) {
        const batch = policy.chunks.slice(
          start,
          start + 20
        );

        const texts = batch.map(
          (chunk) => chunk.text
        );

        console.log(
          `Embedding chunks ${start + 1} to ${
            start + batch.length
          }`
        );

        const vectors =
          await embeddings.embedDocuments(texts);

        vectors.forEach(
          (vector, index) => {
            policy.chunks[
              start + index
            ].embedding = vector;
          }
        );
      }

      await policy.save();

      res.json({
        message:
          "Policy embeddings generated successfully",

        policyId: policy._id,

        chunkCount: policy.chunks.length,

        embeddingDimensions:
          policy.chunks[0].embedding.length
      });

    } catch (error) {
      console.error(
        "LangChain embedding error:",
        error
      );

      res.status(500).json({
        message:
          "Embedding generation failed",

        error: error.message
      });
    }
  }
);
module.exports = router;