import OpenAI from "openai";
import fs from "fs";

class OpenAIService {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_KEY,
    });
  }

  async uploadFile(file: fs.ReadStream) {
    const response = await this.openai.files.create({
      file,
      purpose: "assistants",
    });
    return response;
  }

  private presentationToString(filePath: string): string {
    const data = fs.readFileSync(filePath, "utf-8");
    return data;
  }

  async improvePresentation(fileId: string) {
    const presentationMd = this.presentationToString(
      process.env.PRESENTATION_HERO_PATH || ""
    );

    const response = await this.openai.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "system",
          content: `
You are a **senior software engineer and technical presentation expert**.
Your job is to review a **technical presentation** slide by slide and provide detailed, expert-level feedback focused exclusively on the **technical content** — not on visuals, slide structure, or engagement.

Strictly follow the presentation guideline below:
${presentationMd}

For each slide in the provided presentation:
1. Evaluate the **technical accuracy**, **depth**, and **relevance** of the content.
2. Identify missing context, weak explanations, or gaps in reasoning.
3. Suggest how to make the content more **precise**, **informative**, and **technically strong** — by including clarifications, examples, metrics, comparisons, or architectural insights.
4. Highlight opportunities to enhance technical rigor or connect concepts more clearly.
5. Do **not** comment on design, layout, or engagement elements.

After completing the slide-by-slide analysis, include a **final checklist** that evaluates how well the overall presentation adheres to the provided guideline.  
For each main recommendation or section of the guideline, mark:
- ✅ **Covered** — if the presentation clearly follows or satisfies that guideline point.  
- ⚠️ **Partially covered** — if it touches on it but could be improved.  
- ❌ **Not covered** — if the presentation fails to address it at all.

Format your response in Markdown with the following structure:

---

### Slide-by-Slide Review

- **Slide X: [Title or short summary]**
  - **Technical strengths**
  - **Technical issues**
  - **Missing or weak points**
  - **Suggested improvements** (focused strictly on technical depth and content quality)

---

### Guideline Coverage Checklist

| Guideline Item | Coverage | Notes |
|-----------------|-----------|-------|
| [Guideline point 1] | ✅ / ⚠️ / ❌ | [Short explanation] |
| [Guideline point 2] | ✅ / ⚠️ / ❌ | [Short explanation] |
| ... | ... | ... |

---

Be rigorous, concise, and objective.  
Your tone should reflect that of a **senior engineer** giving **constructive peer feedback** on a technical talk or presentation.
`,
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Please review the presentation file according to the guidelines provided.",
            },
            {
              type: "input_file",
              file_id: fileId,
            },
          ],
        },
      ],
    });

    return response;
  }
}

export default new OpenAIService();
