import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

if (!GEMINI_API_KEY) {
	throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-1.5-flash",
	safetySettings: [
		{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
		{ category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
		{ category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
		{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
	],
	systemInstruction: "You are Echo, a compassionate and supportive emotional wellness assistant. Your goal is to listen empathetically, validate feelings, ask gentle, open-ended questions to encourage reflection (but avoid giving direct advice unless asked), and offer comfort. Keep your responses concise and caring. Do not sound like a robot; be warm and understanding.",
});

export async function getGeminiAdvice(emotion: string, followUpResponses: string[]): Promise<string> {
	const prompt = `I'm feeling ${emotion}. When asked further, I mentioned: ${followUpResponses.join(', ')}. Can you offer some brief, comforting advice or a supportive message? Keep it simple and empathetic.`;

	try {
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.text();
		console.log("Gemini Response:", text);
		return text;
	} catch (error) {
		console.error('Error calling Gemini API:', error);
		return "I'm having a little trouble connecting right now. Please try again in a moment.";
	}
}

export async function getGeminiChatResponse(history: { role: 'user' | 'model', text: string }[]): Promise<string> {
	const mappedHistory = history.map(msg => ({
		role: msg.role,
		parts: [{ text: msg.text }]
	}));

	const lastUserMessage = mappedHistory.pop();
	if (!lastUserMessage || lastUserMessage.role !== 'user') {
		console.error("Chat history doesn't end with a user message.", history);
		return "I seem to have lost track of our conversation. Could you repeat that?";
	}

	console.log("Sending to Gemini:", { history: mappedHistory, lastUserMessage: lastUserMessage.parts[0].text });

	try {
		const chat = model.startChat({ history: mappedHistory });
		const result = await chat.sendMessage(lastUserMessage.parts[0].text);
		const response = result.response;
		const text = response.text();
		console.log("Gemini Chat Response:", text);
		return text;
	} catch (error) {
		console.error('Error calling Gemini Chat API:', error);
		if (error instanceof Error && error.message.includes('SAFETY')) { 
			return "I'm unable to respond to that topic. Let's try talking about something else.";
		}
		return "I'm having a little trouble thinking right now. Please give me a moment.";
	}
} 