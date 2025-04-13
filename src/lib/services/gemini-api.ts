import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"}); // Using Flash model

export async function getGeminiAdvice(emotion: string, followUpResponses: string[]): Promise<string> {
  const prompt = `I'm feeling ${emotion}. When asked further, I mentioned: ${followUpResponses.join(', ')}. Can you offer some brief, comforting advice or a supportive message? Keep it concise and empathetic.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log("Gemini Response:", text);
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Provide a user-friendly error message
    return "I'm having a little trouble connecting right now. Please try again in a moment.";
  }
} 