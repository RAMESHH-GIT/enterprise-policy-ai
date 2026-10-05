const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const generateAIResponse = async (message) => {
  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: message
  });

  return response.text;
};

module.exports = {
  generateAIResponse
};