import "dotenv/config";
import OpenAIService from "./services/openai";
import fs from "fs";

async function main() {
  console.log("Starting presentation improvement process...");
  const file = fs.createReadStream(process.env.PRESENTATION_PATH || "");
  const uploadResponse = await OpenAIService.uploadFile(file);
  console.log("File uploaded:", uploadResponse.id);

  const improvementResponse = await OpenAIService.improvePresentation(
    uploadResponse.id
  );
  console.log("Improvement response:", improvementResponse);

  fs.writeFileSync(
    "improved_presentation_feedback.md",
    improvementResponse.output_text
  );
}

main();
