import { GoogleGenAI } from "@google/genai";
import config from "./config/config";

const apiKey = config.geminiApiKey;

const ai = new GoogleGenAI({ apiKey });

const summarize = async (transcript = "", lang="english") => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Summarize the following transcript in ${lang} language only.
            Transcript: 
            ${transcript}
            `,
            config: {
                systemInstruction: "You are an AI bot for the YouTube Video Summarizer tool. Your sole responsibility is to generate a clear and concise summary based on the transcription of a YouTube video provided to you. Do not include any additional comments, explanations, or metadata—only return the summary of the transcription content.",
            }
        });

        return response.text;
    } catch (error) {
        console.log("Summarize.js :: error: ", error);
    }
}

export default summarize;