import { NormalizedJob } from "@/types/job";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import axios from "axios";

export async function processJobsWithAI(jobs: NormalizedJob[], resumeUrl: string) {
  try {
        
    const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
    const file = Buffer.from(response.data);

    if (!file || file.length === 0) {
      return {
        success: false,
        message: "Resume not found, please upload your resume first",
      };
    }

    const prompt = `
      Analyze the following job dataset and rank relevance to the user's resume.
      Return ONLY a JSON array with each job having: { ...jobFields, matchScore }.
      Sort jobs by matchScore (100 = perfect match).
      NO markdown. NO explanation. JSON ONLY.

      Job Dataset:
      ${JSON.stringify(jobs)}
    `;

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "file", data: file, mimeType: "application/pdf" },
          ],
        },
      ],
    });

    let output = result.text.trim();
    
    if (output.startsWith("```")) {
      output = output.replace(/```(json)?/g, "").trim();
    }

    const data = JSON.parse(output);

    if (!Array.isArray(data)) {
      return { success: false, message: "Invalid AI format" };
    }

    return {
      success: true,
      message: "Jobs processed successfully",
      data,
    };

  } catch (err) {
    console.error("AI processing error:", err);
    return {
      success: false,
      message: "Error processing jobs",
    };
  }
}
