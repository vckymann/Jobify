import { NormalizedJob } from "@/types/job";
import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import axios from "axios";


export async function processJobsWithAI(jobs: NormalizedJob[], resumeUrl: string) {

  const response = await axios.get(resumeUrl, { responseType: "arraybuffer" });
  const file = Buffer.from(response.data);

  if (!file) {
    return {
      success: false,
      message: "Resume not found, please upload your resume first",
    };
  }

  const prompt = `

  1. **Job Dataset**: 
  ${JSON.stringify(jobs)}
  
  ### Task:
  1. Analyze the user's profile and compare it with the dataset and evaluate their relevance to the user's profile.  
  2. Assign a matchScore (from 0 to 100) to each job object. A higher score indicates a better match.
  3. DO NOT include any additional content.
  4. Return the dataset only with the added matchScore for each job. The response should be in JSON format and sorted by matchScore in descending order.`  

  let fullResponse = "";
  
  try {
    const result = await streamText({
      model: google("gemini-2.0-flash-exp"),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt,
            },
            {
              type: 'file',
              data: file,
              mimeType: 'application/pdf',
            },
          ],
        },
      ],
    });

    for await(const textPart of result.textStream) {
      fullResponse += textPart;
    }

    let cleanedText = fullResponse.trim()
    if(cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7)
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }

    cleanedText = cleanedText.trim();
    
    const data = JSON.parse(cleanedText);
    

    if(!Array.isArray(data) || data.some(job => typeof job.matchScore !== "number") ) {
      return {
        success:false,
        message:"Invalid AI format"
      }
    }

    return {
      success: true,
      message: "Jobs processed successfully",
      data,
    };
  } catch (error) {
    console.log("Error generating job match:", error);
    return {
      success: false,
      message: "Error processing jobs",
    };
  }
}
