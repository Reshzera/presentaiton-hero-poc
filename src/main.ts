import "dotenv/config";
import OpenAI from "openai";

const openaiApiKey = process.env.OPEN_AI_KEY;

if (!openaiApiKey) {
  throw new Error("OPENAI_API_KEY is not set in environment variables.");
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

function main() {}

main();
