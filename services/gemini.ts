import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { MODEL_CHAT, MODEL_IMAGE, MODEL_THEORY } from "../constants";
import { TheoryResponse } from "../types";

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  // Always create a new instance to pick up potentially updated process.env.API_KEY
  // especially after a user selects a paid key for Veo/Image/Pro models.
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateTheoryData = async (userPrompt: string): Promise<TheoryResponse> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: MODEL_THEORY,
    contents: userPrompt,
    config: {
      systemInstruction: `You are a music theory expert. precise. 
      Analyze the user's request (e.g., "C Major", "G7 chord", "A Minor Harmonic").
      Return a JSON object with the name, type ("scale" or "chord"), the constituent notes (using sharps # for accidentals where possible, e.g., F#, not Gb, to keep it simple for visualization unless Flat is strictly standard for that key, but try to normalize to: C, C#, D, D#, E, F, F#, G, G#, A, A#, B), and a brief 1 sentence description.
      `,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['scale', 'chord'] },
          notes: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          description: { type: Type.STRING }
        },
        required: ["name", "type", "notes", "description"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as TheoryResponse;
};

export const createChatSession = (): Chat => {
  const ai = getAiClient();
  return ai.chats.create({
    model: MODEL_CHAT,
    config: {
      systemInstruction: "You are a helpful, knowledgeable music theory tutor named Lumina. You help users understand complex music concepts, history, and composition techniques. Keep answers concise but informative."
    }
  });
};

export const generateMusicImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string> => {
  const ai = getAiClient();
  
  const response = await ai.models.generateContent({
    model: MODEL_IMAGE,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        imageSize: size,
        aspectRatio: "1:1"
      }
    }
  });

  // Iterate to find image part
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
       return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated.");
};

// Helper to check for API key requirement for Pro Image model
export const checkApiKeySelection = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return true; // Default to true if not in the specific environment that requires this
};

export const promptForKeySelection = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  }
};
