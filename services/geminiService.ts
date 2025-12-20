
import { GoogleGenAI, Type } from "@google/genai";
import { Domain } from "../types";

export const refineValueWithAI = async (domain: Domain, roughDraft: string): Promise<string> => {
  // Use API_KEY directly from environment variables as required by guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Transform this rough draft into a concise, action-oriented value statement for the ${domain} domain. 
      Remember: A value is a direction (e.g., "being a loving partner"), not a goal that can be achieved (e.g., "getting married").
      Rough draft: "${roughDraft}"`,
      config: {
        systemInstruction: "You are an expert in Acceptance and Commitment Therapy (ACT). Your task is to turn user thoughts into high-quality value statements that reflect ongoing directions of living.",
        temperature: 0.7,
      },
    });

    // Access the .text property directly as it is a getter
    return response.text?.trim() || roughDraft;
  } catch (error) {
    console.error("AI Refinement Error:", error);
    return roughDraft;
  }
};
