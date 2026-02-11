import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey: geminiApiKey });

export async function askGemini(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${prompt}.Just answer the question. But, do not more than 2000 characters.`,
    });

    return response.text || "No response";
}

export async function askGeminiMotivation(): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Berikan saya kata-kata motivasi hari ini, langsung saja. Hasilnya tidak lebih dari 2000 karakter.",
    });

    return response.text || "No response";
}