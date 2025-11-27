
import { GoogleGenAI } from "@google/genai";
import { bioText, projects, experience } from '../data/portfolioData';

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

const modelId = 'gemini-2.5-flash';

const systemInstruction = `
You are an AI assistant for Rosean Frank-Alexander's portfolio website.
Your role is to answer questions about Rosean's professional background, skills, projects, and experience based on the provided context.
You should be professional, friendly, and concise.

Here is the context about Rosean:
Bio: ${bioText}

Projects:
${projects.map(p => `- ${p.title}: ${p.description} (Roles: ${p.roles.join(', ')})`).join('\n')}

Experience:
${experience.map(e => `- ${e.role} at ${e.company} (${e.date}): ${e.description}`).join('\n')}

Skills: React, Tailwind CSS, UI/UX Design, Product Management, Figma, Adobe Creative Cloud.

If a user asks for contact info, direct them to the contact section or email rosean.frankalexander@gmail.com.
Do not make up information not present in the context.
`;

export const sendMessageToGemini = async (message: string, history: {role: 'user' | 'model', parts: {text: string}[]}[] = []) => {
  try {
    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};
