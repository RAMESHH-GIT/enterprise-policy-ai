const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const EMBEDDING_MODEL = "gemini-embedding-001";

const generateEmbeddings = async (texts, taskType) => {
  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: texts,
    config: {
      taskType,
      outputDimensionality: 768
    }
  });

  return response.embeddings.map(
    (embedding) => embedding.values
  );
};

module.exports = {
  generateEmbeddings
};