const Policy = require("../models/Policy");
const { embeddings } = require("./embeddings");

const cosineSimilarity = (a, b) => {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  return (
    dotProduct /
    (Math.sqrt(magnitudeA) *
      Math.sqrt(magnitudeB))
  );
};

const getKeywords = (question) => {
  return question
    .toLowerCase()
    .replace(/[?.,]/g, "")
    .split(" ")
    .filter(
      (word) =>
        word.length > 3 &&
        ![
          "what",
          "which",
          "does",
          "company",
          "about",
          "policy"
        ].includes(word)
    );
};

const searchPolicies = async (
  question,
  topK = 5
) => {
  const questionEmbedding =
    await embeddings.embedQuery(question);

  const policy = await Policy.findOne({
    status: "active",
    "chunks.0.embedding": {
      $exists: true
    }
  }).lean();

  if (!policy) {
    return [];
  }

  const keywords = getKeywords(question);

  const results = [];

  for (const chunk of policy.chunks) {
    if (
      !chunk.embedding ||
      chunk.embedding.length === 0
    ) {
      continue;
    }

    const semanticScore = cosineSimilarity(
      questionEmbedding,
      chunk.embedding
    );

    const chunkText =
      chunk.text.toLowerCase();

    let keywordMatches = 0;

    keywords.forEach((keyword) => {
      if (chunkText.includes(keyword)) {
        keywordMatches++;
      }
    });

    const keywordScore =
      keywords.length > 0
        ? keywordMatches / keywords.length
        : 0;

    const finalScore =
      semanticScore * 0.7 +
      keywordScore * 0.3;

    results.push({
      text: chunk.text,
      score: finalScore,
      semanticScore,
      keywordScore
    });
  }

  results.sort(
    (a, b) => b.score - a.score
  );

  return results.slice(0, topK);
};

module.exports = {
  searchPolicies
};