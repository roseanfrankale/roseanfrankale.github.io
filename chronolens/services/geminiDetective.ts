import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from '../types';

// Helper to convert blob/file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzePhotoWithGemini = async (
  base64Image: string, 
  exifData: string | undefined
): Promise<AnalysisResult> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      estimatedYearRange: {
        type: Type.ARRAY,
        items: { type: Type.INTEGER },
        description: "A tuple of two years [start, end] representing the estimated era.",
      },
      locationClues: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of specific visual clues indicating location (e.g., 'French License Plate', 'Eiffel Tower', 'Vintage Coca-Cola Sign').",
      },
      reasoning: {
        type: Type.STRING,
        description: "Detailed detective-style deduction. Analyze fashion, cars, technology, and film grain.",
      },
      isConflict: {
        type: Type.BOOLEAN,
        description: "True if visual evidence strongly contradicts the claimed EXIF date (The Costume Party Paradox).",
      },
      confidenceScore: {
        type: Type.NUMBER,
        description: "Confidence level between 0 and 1.",
      }
    },
    required: ["estimatedYearRange", "locationClues", "reasoning", "isConflict", "confidenceScore"],
  };

  const prompt = `
    Act as a "Skeptical Detective AI". Analyze this photo for chronological authenticity and location.
    
    Claimed Date (EXIF): ${exifData || "Unknown"}
    
    Tasks:
    1. Identify the decade based on clothing, hairstyles, objects, vehicles, and signage.
    2. Verify if the claimed date matches the visual evidence.
    3. If there is a potential conflict (e.g., modern smart watch in a 1950s photo, or 2024 EXIF on a 19th century tintype), flag 'isConflict' as true. This is the "Costume Party Paradox".
    4. Extract specific location clues.
    
    Provide your output strictly as JSON adhering to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.4, 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
};