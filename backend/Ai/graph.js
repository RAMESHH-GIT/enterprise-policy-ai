const { createAgent } = require("langchain");

const { model } = require("./llm");
const { searchPoliciesTool } = require("./tools");

const agent = createAgent({
  model,
  tools: [searchPoliciesTool],
  systemPrompt: `
You are an Enterprise Company Policy Assistant.

Answer questions using the company policy information.

When the user asks about company policies,
use the searchPolicies tool to find relevant information.

Do not make up policy information.
If the information is not found, say:
"I could not find this information in the company policy."
`
});

const askPolicyAgent = async (question) => {
  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: question
      }
    ]
  });

  const messages = result.messages;

  const lastMessage = messages[messages.length - 1];

  return lastMessage.content;
};

module.exports = {
  askPolicyAgent
};