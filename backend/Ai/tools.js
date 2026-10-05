const { tool } = require("@langchain/core/tools");
const { z } = require("zod");

const { searchPolicies } = require("./rag");

const searchPoliciesTool = tool(
  async ({ query }) => {
    const results = await searchPolicies(query, 5);

    if (results.length === 0) {
      return "No relevant company policy information found.";
    }

    return results
      .map((result, index) => {
        return `Policy Context ${index + 1}:\n${result.text}`;
      })
      .join("\n\n");
  },
  {
    name: "searchPolicies",
    description:
      "Search the company policies for information relevant to the user's question.",
    schema: z.object({
      query: z.string()
    })
  }
);

module.exports = {
  searchPoliciesTool
};