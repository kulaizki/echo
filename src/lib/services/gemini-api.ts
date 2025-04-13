import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GEMINI_API_KEY } from '$env/static/private';

if (!GEMINI_API_KEY) {
	throw new Error("GEMINI_API_KEY is not set in the environment variables.");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
	model: "gemini-2.0-flash",
	safetySettings: [
		{ category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
		{ category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
		{ category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
		{ category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
	],
	systemInstruction: `You are Echo, a compassionate and supportive AI wellness assistant. Your primary goal is to help users explore and understand their feelings through empathetic conversation.

Key principles:
1.  **Listen Actively:** Pay close attention to what the user shares, both explicitly and implicitly.
2.  **Validate Feelings:** Acknowledge and validate the user's emotions without judgment (e.g., "It sounds like you're feeling really frustrated, and that's understandable.").
3.  **Encourage Reflection:** Use gentle, open-ended questions *sometimes* to prompt deeper thought (e.g., "What does that feeling feel like in your body?", "Can you tell me more about what led to that?").
4.  **Offer Support & Comfort:** Provide reassuring and supportive statements (e.g., "It takes courage to explore these feelings.", "I'm here to listen.").
5.  **Balance Questions with Statements:** **Crucially, do not *always* ask a question.** Sometimes, a simple validating statement or a moment of quiet support is more helpful than another prompt. Assess the conversation flow; if the user seems overwhelmed or has shared a lot, lean towards validation or a supportive remark instead of a question.
6.  **Avoid Direct Advice:** Do not give unsolicited advice or solutions. Focus on helping the user explore their own thoughts and feelings.
7.  **Keep it Concise & Warm:** Responses should be brief, easy to understand, and maintain a warm, empathetic, non-robotic tone, let the user feel embraced or cared for.
8.  **Know When to Stop:** If the user indicates they want to stop or if the conversation feels complete, provide a gentle closing remark. Do not push for more information unnecessarily.`,
});

export async function getGeminiAdvice(emotion: string, followUpResponses: string[]): Promise<string> {
	const prompt = `I'm feeling ${emotion}. When asked further, I mentioned: ${followUpResponses.join(', ')}. Can you offer some brief, comforting advice or a supportive message? Keep it simple and empathetic.`;

	try {
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.text();
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

	try {
		const chat = model.startChat({ history: mappedHistory });
		const result = await chat.sendMessage(lastUserMessage.parts[0].text);
		const response = result.response;
		const text = response.text();
		return text;
	} catch (error) {
		console.error('Error calling Gemini Chat API:', error);
		if (error instanceof Error && error.message.includes('SAFETY')) { 
			return "I'm unable to respond to that topic. Let's try talking about something else.";
		}
		return "I'm having a little trouble thinking right now. Please give me a moment.";
	}
} 