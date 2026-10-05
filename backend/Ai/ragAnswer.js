const { model } = require("./llm");
const { searchPolicies } = require("./rag");

const answerPolicyQuestion = async (question) => {
  const results = await searchPolicies(question, 5);

  if (results.length === 0) {
    return "I could not find relevant information in the company policy.";
  }

  const context = results
    .map((result, index) => {
      return `Policy Context ${index + 1}:\n${result.text}`;
    })
    .join("\n\n");

  const prompt = `
You are an Enterprise Company Policy Assistant.

Answer the user's question using ONLY the policy context provided below.

If the answer is not available in the policy context, say:
"I could not find this information in the company policy."

Do not make up policy information.

Policy Context:
${context}

User Question:
${question}
`;

  const response = await model.invoke(prompt);

  return response.content;
};

module.exports = {
  answerPolicyQuestion
};